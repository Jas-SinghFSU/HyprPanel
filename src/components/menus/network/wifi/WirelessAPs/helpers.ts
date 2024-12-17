import { bind, execAsync, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { DEVICE_STATES } from 'src/lib/constants/network';
import { networkService } from 'src/lib/constants/services';
import { isPrimaryClick, Notify } from 'src/lib/utils';

export const isWifiEnabled: Variable<boolean> = Variable(false);
export const wifiAccessPoints: Variable<AstalNetwork.AccessPoint[]> = Variable([]);

let wifiEnabledBinding: Variable<void>;
let accessPointBinding: Variable<void>;

const wifiEnabled = (): void => {
    if (wifiEnabledBinding) {
        wifiEnabledBinding();
        wifiEnabledBinding.drop();
    }

    if (!networkService.wifi) {
        return;
    }

    wifiEnabledBinding = Variable.derive([bind(networkService.wifi, 'enabled')], (isEnabled) => {
        isWifiEnabled.set(isEnabled);
    });
};

const accessPoints = (): void => {
    if (accessPointBinding) {
        accessPointBinding();
        accessPointBinding.drop();
    }

    if (!networkService.wifi) {
        return;
    }

    Variable.derive([bind(networkService.wifi, 'accessPoints')], (axsPoints) => {
        wifiAccessPoints.set(axsPoints);
    });
};

Variable.derive([bind(networkService, 'wifi')], () => {
    wifiEnabled();
    accessPoints();
});

/**
 * Removes duplicate access points based on their SSID.
 *
 * @returns An array of deduplicated access points.
 */
const dedupeWAPs = (): AstalNetwork.AccessPoint[] => {
    if (!networkService.wifi) {
        return [];
    }

    const WAPs = networkService.wifi.accessPoints;
    const dedupMap: Record<string, AstalNetwork.AccessPoint> = {};

    WAPs.forEach((item: AstalNetwork.AccessPoint) => {
        if (item.ssid !== null && !Object.prototype.hasOwnProperty.call(dedupMap, item.ssid)) {
            dedupMap[item.ssid] = item;
        }
    });

    return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
};

/**
 * Determines if a given access point is currently in the staging area.
 *
 * @param wap - The access point to check.
 * @param staging - A variable holding the staging access point.
 * @returns True if the access point is in staging; otherwise, false.
 */
const isInStaging = (wap: AstalNetwork.AccessPoint, staging: Variable<AstalNetwork.AccessPoint>): boolean => {
    if (Object.keys(staging.get()).length === 0) {
        return false;
    }

    return wap.bssid === staging.get().bssid;
};

/**
 * Retrieves a list of filtered wireless access points by removing duplicates and excluding specific entries.
 *
 * @param staging - A variable holding the staging access point.
 * @returns A filtered array of wireless access points.
 */
export const getFilteredWirelessAPs = (staging: Variable<AstalNetwork.AccessPoint>): AstalNetwork.AccessPoint[] => {
    const dedupedWAPs = dedupeWAPs();

    const filteredWAPs = dedupedWAPs
        .filter((ap: AstalNetwork.AccessPoint) => {
            return ap.ssid !== 'Unknown' && !isInStaging(ap, staging);
        })
        .sort((a: AstalNetwork.AccessPoint, b: AstalNetwork.AccessPoint) => {
            if (isApActive(a)) {
                return -1;
            }

            if (isApActive(b)) {
                return 1;
            }

            return b.strength - a.strength;
        });

    return filteredWAPs;
};

/**
 * Determines whether the device is in a active state.
 *
 * @param state - The current state of the device.
 * @returns - Returns true if the status should be shown, false otherwise.
 */
export const isApEnabled = (state: AstalNetwork.DeviceState | undefined): boolean => {
    if (!state) {
        return false;
    }

    return !(
        state === AstalNetwork.DeviceState.DISCONNECTED ||
        state === AstalNetwork.DeviceState.UNAVAILABLE ||
        state === AstalNetwork.DeviceState.FAILED
    );
};

/**
 * Checks if the given access point is the currently active one.
 *
 * @param accessPoint - The access point to check.
 * @returns - Returns true if the access point is active, false otherwise.
 */
export const isApActive = (accessPoint: AstalNetwork.AccessPoint): boolean => {
    return accessPoint.ssid === networkService.wifi?.activeAccessPoint?.ssid;
};

/**
 * Checks if the specified access point is in the process of disconnecting.
 *
 * @param accessPoint - The access point to check.
 * @returns True if the access point is disconnecting; otherwise, false.
 */
export const isDisconnecting = (accessPoint: AstalNetwork.AccessPoint): boolean => {
    if (isApActive(accessPoint)) {
        return networkService.wifi?.state === AstalNetwork.DeviceState.DEACTIVATING;
    }
    return false;
};

/**
 * Extracts the connection ID associated with a given SSID from the `nmcli` command output.
 *
 * @param ssid - The SSID of the network.
 * @param nmcliOutput - The output string from the `nmcli` command.
 * @returns The connection ID if found; otherwise, undefined.
 */
export const getIdFromSsid = (ssid: string, nmcliOutput: string): string | undefined => {
    const lines = nmcliOutput.trim().split('\n');
    for (const line of lines) {
        const columns = line.trim().split(/\s{2,}/);
        if (columns[0].includes(ssid)) {
            return columns[1];
        }
    }
};

/**
 * Retrieves the current Wi-Fi status based on the network service state.
 *
 * @returns A string representing the current Wi-Fi status.
 */
export const getWifiStatus = (): string => {
    const wifiState = networkService.wifi?.state;

    if (wifiState) {
        return DEVICE_STATES[wifiState];
    }
    return DEVICE_STATES[AstalNetwork.DeviceState.UNKNOWN];
};

/**
 * Initiates a connection to the specified access point.
 *
 * @param accessPoint - The access point to connect to.
 * @param connecting - A variable tracking the current connection attempt.
 * @param staging - A variable holding the staging access point.
 * @param event - The click event triggering the connection.
 *
 * BUG: Causes a crash when the user tries to connect to a network in occasion. Remove in favor of
 * the new AstalNetwork connection interface when implemented.
 */
export const connectToAP = (
    accessPoint: AstalNetwork.AccessPoint,
    connecting: Variable<string>,
    staging: Variable<AstalNetwork.AccessPoint>,
    event: Astal.ClickEvent,
): void => {
    if (accessPoint.bssid === connecting.get() || isApActive(accessPoint) || !isPrimaryClick(event)) {
        return;
    }

    connecting.set(accessPoint.bssid || '');
    execAsync(`nmcli device wifi connect ${accessPoint.bssid}`)
        .then(() => {
            connecting.set('');
            staging.set({} as AstalNetwork.AccessPoint);
        })
        .catch((err) => {
            connecting.set('');
            if (err.message?.toLowerCase().includes('secrets were required, but not provided')) {
                staging.set(accessPoint);
            } else {
                Notify({
                    summary: 'Network',
                    body: err.message,
                    timeout: 5000,
                });
            }
        });
};

/**
 * Disconnects from the specified access point.
 *
 * @param accessPoint - The access point to disconnect from.
 * @param connecting - A variable tracking the current connection attempt.
 * @param event - The click event triggering the disconnection.
 */
export const disconnectFromAP = (
    accessPoint: AstalNetwork.AccessPoint,
    connecting: Variable<string>,
    event: Astal.ClickEvent,
): void => {
    if (!isPrimaryClick(event)) {
        return;
    }

    connecting.set(accessPoint.bssid || '');
    execAsync('nmcli connection show --active').then((res: string) => {
        const connectionId = getIdFromSsid(accessPoint.ssid || '', res);

        if (connectionId === undefined) {
            console.error(`Error while disconnecting "${accessPoint.ssid}": Connection ID not found`);
            return;
        }

        execAsync(`nmcli connection down ${connectionId} "${accessPoint.ssid}"`)
            .then(() => {
                connecting.set('');
            })
            .catch((err: unknown) => {
                connecting.set('');
                console.error(`Error while disconnecting "${accessPoint.ssid}": ${err}`);
            });
    });
};

/**
 * Forgets the specified access point by deleting its connection.
 *
 * @param accessPoint - The access point to forget.
 * @param connecting - A variable tracking the current connection attempt.
 * @param event - The click event triggering the forget action.
 */
export const forgetAP = (
    accessPoint: AstalNetwork.AccessPoint,
    connecting: Variable<string>,
    event: Astal.ClickEvent,
): void => {
    if (!isPrimaryClick(event)) {
        return;
    }
    connecting.set(accessPoint.bssid || '');
    execAsync('nmcli connection show --active').then((res: string) => {
        const connectionId = getIdFromSsid(accessPoint.ssid || '', res);

        if (connectionId === undefined) {
            console.error(`Error while forgetting "${accessPoint.ssid}": Connection ID not found`);
            return;
        }

        execAsync(`nmcli connection delete ${connectionId} "${accessPoint.ssid}"`)
            .then(() => {
                connecting.set('');
            })
            .catch((err: unknown) => {
                connecting.set('');
                console.error(`Error while forgetting "${accessPoint.ssid}": ${err}`);
            });
    });
};
