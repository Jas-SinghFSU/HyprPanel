import { networkService } from 'src/lib/constants/services';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import { WIFI_STATUS_MAP } from 'src/globals/network.js';
import { execAsync, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { AccessPoint } from 'src/lib/types/network';
import { getWifiIcon } from '../utils';
import { isPrimaryClick, Notify } from 'src/lib/utils';

export const WirelessAPs = ({ staging, connecting }: WirelessAPsProps): JSX.Element => {
    const getIdBySsid = (ssid: string, nmcliOutput: string): string | undefined => {
        const lines = nmcliOutput.trim().split('\n');
        for (const line of lines) {
            const columns = line.trim().split(/\s{2,}/);
            if (columns[0].includes(ssid)) {
                return columns[1];
            }
        }
    };

    const getWifiStatus = (): string => {
        return 'yo';
        const wifiState = networkService.wifi.state?.toString().toLowerCase();

        if (wifiState) {
            return WIFI_STATUS_MAP[wifiState];
        }
        return WIFI_STATUS_MAP['unknown'];
    };

    return (
        <box className="available-waps" vertical>
            {Variable.derive([bind(staging), bind(connecting), bind(networkService, 'wifi')], () => {
                console.log(networkService.wifi.accessPoints.length);
                const WAPs = networkService.wifi.accessPoints;

                const dedupeWAPs = (): AccessPoint[] => {
                    const dedupMap: Record<string, AccessPoint> = {};
                    WAPs.forEach((item: AstalNetwork.AccessPoint) => {
                        if (item.ssid !== null && !Object.prototype.hasOwnProperty.call(dedupMap, item.ssid)) {
                            dedupMap[item.ssid] = item;
                        }
                    });

                    return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
                };

                const dedupedWAPs = dedupeWAPs();

                const isInStaging = (wap: AccessPoint): boolean => {
                    if (Object.keys(staging.get()).length === 0) {
                        return false;
                    }

                    return wap.bssid === staging.get().bssid;
                };

                const isDisconnecting = (wap: AccessPoint): boolean => {
                    if (wap.ssid === networkService.wifi.ssid) {
                        return networkService.wifi.state.toLowerCase() === 'deactivating';
                    }
                    return false;
                };

                const filteredWAPs = dedupedWAPs
                    .filter((ap: AccessPoint) => {
                        return ap.ssid !== 'Unknown' && !isInStaging(ap);
                    })
                    .sort((a: AccessPoint, b: AccessPoint) => {
                        if (networkService.wifi.ssid === a.ssid) {
                            return -1;
                        }

                        if (networkService.wifi.ssid === b.ssid) {
                            return 1;
                        }

                        return b.strength - a.strength;
                    });

                if (filteredWAPs.length <= 0 && Object.keys(staging.get()).length === 0) {
                    return (
                        <label
                            className="waps-not-found dim"
                            expand
                            halign={Gtk.Align.CENTER}
                            valign={Gtk.Align.CENTER}
                            label="No Wi-Fi Networks Found"
                        />
                    );
                }

                return (
                    <box className="available-waps-list" vertical>
                        {filteredWAPs.map((ap: AccessPoint) => {
                            return (
                                <box className="network-element-item">
                                    <button
                                        className="network-element-item"
                                        hexpand
                                        onClick={(_, event) => {
                                            if (ap.bssid === connecting.get() || ap.active || !isPrimaryClick(event)) {
                                                return;
                                            }

                                            connecting.set(ap.bssid || '');
                                            execAsync(`nmcli device wifi connect ${ap.bssid}`)
                                                .then(() => {
                                                    connecting.set('');
                                                    staging.set({} as AccessPoint);
                                                })
                                                .catch((err: string) => {
                                                    if (
                                                        err
                                                            .toLowerCase()
                                                            .includes('secrets were required, but not provided')
                                                    ) {
                                                        staging.set(ap);
                                                    } else {
                                                        Notify({
                                                            summary: 'Network',
                                                            body: err,
                                                            timeout: 5000,
                                                        });
                                                    }
                                                    connecting.set('');
                                                });
                                        }}
                                    >
                                        <box hexpand={true} className="connection-container">
                                            <label
                                                className={`network-icon wifi ${
                                                    ap.ssid === networkService.wifi.ssid ? 'active' : ''
                                                } txt-icon`}
                                                label={getWifiIcon(ap.iconName)}
                                            />
                                            <box className="connection-container">
                                                <label
                                                    className="active-connection"
                                                    halign={Gtk.Align.START}
                                                    truncate
                                                    wrap
                                                    label={ap.ssid ?? ''}
                                                />
                                                <revealer revealChild={ap.ssid === networkService.wifi.ssid}>
                                                    <label
                                                        className="connection-status dim"
                                                        halign={Gtk.Align.START}
                                                        truncate
                                                        wrap
                                                        label={getWifiStatus()}
                                                    />
                                                </revealer>
                                            </box>
                                        </box>
                                        <revealer
                                            className="spinner wap"
                                            revealChild={ap.bssid === connecting.get() || isDisconnecting(ap)}
                                        >
                                            {/* <spinner className="spinner wap" /> */}
                                        </revealer>
                                    </button>

                                    <revealer
                                        className="network-element-item"
                                        revealChild={ap.bssid !== connecting.get() && ap.active}
                                    >
                                        <box>
                                            <button
                                                className="menu-icon-button network disconnect"
                                                onClick={(_, event) => {
                                                    if (!isPrimaryClick(event)) {
                                                        return;
                                                    }

                                                    connecting.set(ap.bssid || '');
                                                    execAsync('nmcli connection show --active').then((res: string) => {
                                                        const connectionId = getIdBySsid(ap.ssid || '', res);

                                                        if (connectionId === undefined) {
                                                            console.error(
                                                                `Error while disconnecting "${ap.ssid}": Connection ID not found`,
                                                            );
                                                            return;
                                                        }

                                                        execAsync(`nmcli connection down ${connectionId} "${ap.ssid}"`)
                                                            .then(() => {
                                                                connecting.set('');
                                                            })
                                                            .catch((err: unknown) => {
                                                                connecting.set('');
                                                                console.error(
                                                                    `Error while disconnecting "${ap.ssid}": ${err}`,
                                                                );
                                                            });
                                                    });
                                                }}
                                            >
                                                <label
                                                    className="menu-icon-button disconnect-network txt-icon"
                                                    tooltipText="Disconnect"
                                                    label="󱘖"
                                                />
                                            </button>
                                            <button
                                                className="menu-icon-button network disconnect"
                                                tooltipText="Delete/Forget Network"
                                                onClick={(_, event) => {
                                                    if (!isPrimaryClick(event)) {
                                                        return;
                                                    }
                                                    connecting.set(ap.bssid || '');
                                                    execAsync('nmcli connection show --active').then((res: string) => {
                                                        const connectionId = getIdBySsid(ap.ssid || '', res);

                                                        if (connectionId === undefined) {
                                                            console.error(
                                                                `Error while forgetting "${ap.ssid}": Connection ID not found`,
                                                            );
                                                            return;
                                                        }

                                                        execAsync(
                                                            `nmcli connection delete ${connectionId} "${ap.ssid}"`,
                                                        )
                                                            .then(() => {
                                                                connecting.set('');
                                                            })
                                                            .catch((err: unknown) => {
                                                                connecting.set('');
                                                                console.error(
                                                                    `Error while forgetting "${ap.ssid}": ${err}`,
                                                                );
                                                            });
                                                    });
                                                }}
                                            >
                                                <label className="txt-icon delete-network" label="󰚃" />
                                            </button>
                                        </box>
                                    </revealer>
                                </box>
                            );
                        })}
                    </box>
                );
            })()}
        </box>
    );
};

interface WirelessAPsProps {
    staging: Variable<AccessPoint>;
    connecting: Variable<string>;
}
