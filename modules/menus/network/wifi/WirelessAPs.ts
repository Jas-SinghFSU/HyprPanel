import { Network } from 'types/service/network.js';
import { AccessPoint, WifiStatus } from 'lib/types/network.js';
import { Variable } from 'types/variable.js';
import { getWifiIcon } from '../utils.js';
import { WIFI_STATUS_MAP } from 'globals/network.js';
import { Attribute, Child } from 'lib/types/widget.js';
import Box from 'types/widgets/box.js';
const renderWAPs = (
    self: Box<Child, Attribute>,
    network: Network,
    staging: Variable<AccessPoint>,
    connecting: Variable<string>,
): void => {
    const getIdBySsid = (ssid: string, nmcliOutput: string): string | undefined => {
        const lines = nmcliOutput.trim().split('\n');
        for (const line of lines) {
            const columns = line.trim().split(/\s{2,}/);
            if (columns[0].includes(ssid)) {
                return columns[1];
            }
        }
    };

    const isValidWifiStatus = (status: string): status is WifiStatus => {
        return status in WIFI_STATUS_MAP;
    };

    const getWifiStatus = (): string => {
        const wifiState = network.wifi.state?.toLowerCase();

        if (wifiState && isValidWifiStatus(wifiState)) {
            return WIFI_STATUS_MAP[wifiState];
        }
        return WIFI_STATUS_MAP['unknown'];
    };

    self.hook(network, () => {
        Utils.merge([staging.bind('value'), connecting.bind('value')], () => {
            // NOTE: Sometimes the network service will yield a "this._device is undefined" when
            // trying to access the "access_points" property. So we must validate that
            // it's not 'undefined'
            // --
            // Also this is an AGS bug that needs to be fixed

            // TODO: Remove @ts-ignore once AGS bug is fixed
            // @ts-expect-error to fix AGS bug
            let WAPs = network.wifi._device !== undefined ? network.wifi['access_points'] : [];

            const dedupeWAPs = (): AccessPoint[] => {
                const dedupMap: Record<string, AccessPoint> = {};
                WAPs.forEach((item: AccessPoint) => {
                    if (item.ssid !== null && !Object.hasOwnProperty.call(dedupMap, item.ssid)) {
                        dedupMap[item.ssid] = item;
                    }
                });

                return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
            };

            WAPs = dedupeWAPs();

            const isInStaging = (wap: AccessPoint): boolean => {
                if (Object.keys(staging.value).length === 0) {
                    return false;
                }

                return wap.bssid === staging.value.bssid;
            };

            const isDisconnecting = (wap: AccessPoint): boolean => {
                if (wap.ssid === network.wifi.ssid) {
                    return network.wifi.state.toLowerCase() === 'deactivating';
                }
                return false;
            };

            const filteredWAPs = WAPs.filter((ap: AccessPoint) => {
                return ap.ssid !== 'Unknown' && !isInStaging(ap);
            }).sort((a: AccessPoint, b: AccessPoint) => {
                if (network.wifi.ssid === a.ssid) {
                    return -1;
                }

                if (network.wifi.ssid === b.ssid) {
                    return 1;
                }

                return b.strength - a.strength;
            });

            if (filteredWAPs.length <= 0 && Object.keys(staging.value).length === 0) {
                return (self.child = Widget.Label({
                    class_name: 'waps-not-found dim',
                    expand: true,
                    hpack: 'center',
                    vpack: 'center',
                    label: 'No Wi-Fi Networks Found',
                }));
            }
            return (self.children = filteredWAPs.map((ap: AccessPoint) => {
                return Widget.Box({
                    children: [
                        Widget.Button({
                            on_primary_click: () => {
                                if (ap.bssid === connecting.value || ap.active) {
                                    return;
                                }

                                connecting.value = ap.bssid || '';
                                Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`)
                                    .then(() => {
                                        connecting.value = '';
                                        staging.value = {} as AccessPoint;
                                    })
                                    .catch((err) => {
                                        if (err.toLowerCase().includes('secrets were required, but not provided')) {
                                            staging.value = ap;
                                        } else {
                                            Utils.notify({
                                                summary: 'Network',
                                                body: err,
                                                timeout: 5000,
                                            });
                                        }
                                        connecting.value = '';
                                    });
                            },
                            class_name: 'network-element-item',
                            child: Widget.Box({
                                hexpand: true,
                                children: [
                                    Widget.Box({
                                        hpack: 'start',
                                        hexpand: true,
                                        children: [
                                            Widget.Label({
                                                vpack: 'start',
                                                class_name: `network-icon wifi ${ap.ssid === network.wifi.ssid ? 'active' : ''} txt-icon`,
                                                label: getWifiIcon(`${ap['iconName']}`),
                                            }),
                                            Widget.Box({
                                                class_name: 'connection-container',
                                                vpack: 'center',
                                                vertical: true,
                                                children: [
                                                    Widget.Label({
                                                        vpack: 'center',
                                                        class_name: 'active-connection',
                                                        hpack: 'start',
                                                        truncate: 'end',
                                                        wrap: true,
                                                        label: ap.ssid,
                                                    }),
                                                    Widget.Revealer({
                                                        revealChild: ap.ssid === network.wifi.ssid,
                                                        child: Widget.Label({
                                                            hpack: 'start',
                                                            class_name: 'connection-status dim',
                                                            label: getWifiStatus(),
                                                        }),
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    Widget.Revealer({
                                        hpack: 'end',
                                        vpack: 'start',
                                        reveal_child: ap.bssid === connecting.value || isDisconnecting(ap),
                                        child: Widget.Spinner({
                                            vpack: 'start',
                                            class_name: 'spinner wap',
                                        }),
                                    }),
                                ],
                            }),
                        }),
                        Widget.Revealer({
                            vpack: 'start',
                            reveal_child: ap.bssid !== connecting.value && ap.active,
                            child: Widget.Button({
                                tooltip_text: 'Delete/Forget Network',
                                class_name: 'menu-icon-button network disconnect',
                                on_primary_click: () => {
                                    connecting.value = ap.bssid || '';
                                    Utils.execAsync('nmcli connection show --active').then(() => {
                                        Utils.execAsync('nmcli connection show --active').then((res) => {
                                            const connectionId = getIdBySsid(ap.ssid || '', res);

                                            if (connectionId === undefined) {
                                                console.error(
                                                    `Error while forgetting "${ap.ssid}": Connection ID not found`,
                                                );
                                                return;
                                            }

                                            Utils.execAsync(`nmcli connection delete ${connectionId} "${ap.ssid}"`)
                                                .then(() => (connecting.value = ''))
                                                .catch((err) => {
                                                    connecting.value = '';
                                                    console.error(`Error while forgetting "${ap.ssid}": ${err}`);
                                                });
                                        });
                                    });
                                },
                                child: Widget.Label({
                                    class_name: 'txt-icon delete-network',
                                    label: '󰚃',
                                }),
                            }),
                        }),
                    ],
                });
            }));
        });
    });
};

export { renderWAPs };
