import { bind, execAsync, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { DEVICE_STATES } from 'src/lib/constants/network';
import { networkService } from 'src/lib/constants/services';
import { isPrimaryClick, Notify } from 'src/lib/utils';

export const isWifiEnabled: Variable<boolean> = Variable(false);
export const wifiAccessPoints: Variable<AstalNetwork.AccessPoint[]> = Variable([]);

let wifiEnabledBinding: Variable<void> | undefined;
let accessPointBinding: Variable<void> | undefined;

export const staging = Variable<AstalNetwork.AccessPoint | undefined>(undefined);
export const connecting = Variable<string>('');

/**
 * Checks if WiFi is enabled and updates the `isWifiEnabled` variable.
 *
 * This function sets up a binding to the `enabled` property of the WiFi service.
 * If the WiFi service is available, it updates the `isWifiEnabled` variable based on the enabled state.
 */
const wifiEnabled = (): void => {
    wifiEnabledBinding?.drop();
    wifiEnabledBinding = undefined;

    if (!networkService.wifi) {
        return;
    }

    wifiEnabledBinding = Variable.derive([bind(networkService.wifi, 'enabled')], (isEnabled) => {
        isWifiEnabled.set(isEnabled);
    });
};

/**
 * Updates the list of WiFi access points.
 *
 * This function sets up a binding to the `accessPoints` property of the WiFi service.
 * If the WiFi service is available, it updates the `wifiAccessPoints` variable with the list of access points.
 */
const accessPoints = (): void => {
    accessPointBinding?.drop();
    accessPointBinding = undefined;

    if (!networkService.wifi) {
        return;
    }

    Variable.derive([bind(networkService.wifi, 'accessPoints')], (axsPoints) => {
        wifiAccessPoints.set(axsPoints);
    });
};

/**
 * Removes duplicate access points based on their SSID.
 *
 * This function iterates through the list of access points and removes duplicates based on their SSID.
 * It returns an array of deduplicated access points.
 *
 * @returns An array of deduplicated access points.
 */
const dedupeWAPs = (): AstalNetwork.AccessPoint[] => {
    if (!networkService.wifi) {
        return [];
    }

    const WAPs = networkService.wifi.get_access_points();
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
 * This function checks if the provided access point is in the staging area by comparing its BSSID with the BSSID of the staged access point.
 *
 * @param wap The access point to check.
 *
 * @returns True if the access point is in staging; otherwise, false.
 */
const isInStaging = (wap: AstalNetwork.AccessPoint): boolean => {
    const wapInStaging = staging.get();
    if (wapInStaging === undefined) {
        return false;
    }

    return wap.bssid === wapInStaging.bssid;
};

/**
 * Retrieves a list of filtered wireless access points by removing duplicates and excluding specific entries.
 *
 * This function filters the list of access points by removing duplicates and excluding access points with the SSID 'Unknown' or those in the staging area.
 * It also sorts the access points by their signal strength and active status.
 *
 * @returns A filtered array of wireless access points.
 */
export const getFilteredWirelessAPs = (): AstalNetwork.AccessPoint[] => {
    const dedupedWAPs = dedupeWAPs();

    const filteredWAPs = dedupedWAPs
        .filter((ap: AstalNetwork.AccessPoint) => {
            return ap.ssid !== 'Unknown' && !isInStaging(ap);
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
 * Determines whether the device is in an active state.
 *
 * This function checks if the provided device state is active by comparing it with the disconnected, unavailable, and failed states.
 *
 * @param state The current state of the device.
 *
 * @returns True if the device is in an active state; otherwise, false.
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
 * This function compares the SSID of the provided access point with the SSID of the active access point in the WiFi service.
 *
 * @param accessPoint The access point to check.
 *
 * @returns True if the access point is active; otherwise, false.
 */
export const isApActive = (accessPoint: AstalNetwork.AccessPoint): boolean => {
    return accessPoint.ssid === networkService.wifi?.activeAccessPoint?.ssid;
};

/**
 * Checks if the specified access point is in the process of disconnecting.
 *
 * This function checks if the provided access point is the active one and if the WiFi service state is deactivating.
 *
 * @param accessPoint The access point to check.
 *
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
 * This function parses the output of the `nmcli` command to find the connection ID associated with the provided SSID.
 *
 * @param ssid The SSID of the network.
 * @param nmcliOutput The output string from the `nmcli` command.
 *
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
 * This function returns a string representing the current Wi-Fi status based on the state of the WiFi service.
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
 * This function attempts to connect to the provided access point using the `nmcli` command.
 * It handles connection attempts, updates the `connecting` variable, and manages errors.
 *
 * @param accessPoint The access point to connect to.
 * @param event The click event triggering the connection.
 */
export const connectToAP = (accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void => {
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
                });
            }
        });
};

/**
 * Disconnects from the specified access point.
 *
 * This function attempts to disconnect from the provided access point using the `nmcli` command.
 * It handles disconnection attempts, updates the `connecting` variable, and manages errors.
 *
 * @param accessPoint The access point to disconnect from.
 * @param event The click event triggering the disconnection.
 */
export const disconnectFromAP = (accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void => {
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
 * This function attempts to forget the provided access point by deleting its connection using the `nmcli` command.
 * It handles the forget action, updates the `connecting` variable, and manages errors.
 *
 * @param accessPoint The access point to forget.
 * @param event The click event triggering the forget action.
 */
export const forgetAP = (accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void => {
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

Variable.derive([bind(networkService, 'wifi')], () => {
    wifiEnabled();
    accessPoints();
});
