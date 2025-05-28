import { bind, execAsync, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { isPrimaryClick } from 'src/lib/events/mouse';
import { AP_FLAGS, DEVICE_STATES } from './types';

/**
 * WifiManager handles all WiFi-related functionality for staging and connecting to
 * wireless networks
 */
export class WifiManager {
    private _astalNetwork: AstalNetwork.Network;

    public isWifiEnabled: Variable<boolean> = Variable(false);
    public isScanning: Variable<boolean> = Variable(false);
    public wifiAccessPoints: Variable<AstalNetwork.AccessPoint[]> = Variable([]);
    public staging = Variable<AstalNetwork.AccessPoint | undefined>(undefined);
    public connecting = Variable<string>('');

    private _wifiEnabledBinding: Variable<void> | undefined;
    private _scanningBinding: Variable<void> | undefined;
    private _accessPointBinding: Variable<void> | undefined;

    constructor(networkService: AstalNetwork.Network) {
        this._astalNetwork = networkService;
    }

    /**
     * Called when the WiFi service changes to update bindings
     */
    public onWifiServiceChanged(): void {
        this._wifiEnabled();
        this._scanningStatus();
        this._accessPoints();
    }

    /**
     * Checks if WiFi is enabled and updates the `isWifiEnabled` variable.
     */
    private _wifiEnabled(): void {
        this._wifiEnabledBinding?.drop();
        this._wifiEnabledBinding = undefined;

        if (this._astalNetwork.wifi === null) {
            return;
        }

        this._wifiEnabledBinding = Variable.derive(
            [bind(this._astalNetwork.wifi, 'enabled')],
            (isEnabled) => {
                this.isWifiEnabled.set(isEnabled);
            },
        );
    }

    /**
     * Updates the WiFi scanning status.
     */
    private _scanningStatus(): void {
        this._scanningBinding?.drop();
        this._scanningBinding = undefined;

        if (this._astalNetwork.wifi === null) {
            return;
        }

        this._scanningBinding = Variable.derive([bind(this._astalNetwork.wifi, 'scanning')], (scanning) => {
            this.isScanning.set(scanning);
        });
    }

    /**
     * Updates the list of WiFi access points.
     */
    private _accessPoints(): void {
        this._accessPointBinding?.drop();
        this._accessPointBinding = undefined;

        if (this._astalNetwork.wifi === null) {
            return;
        }

        Variable.derive([bind(this._astalNetwork.wifi, 'accessPoints')], (axsPoints) => {
            this.wifiAccessPoints.set(axsPoints);
        });
    }

    /**
     * Removes duplicate access points based on their SSID.
     *
     * @returns An array of deduplicated access points.
     */
    private _dedupeWAPs(): AstalNetwork.AccessPoint[] {
        if (this._astalNetwork.wifi === null) {
            return [];
        }

        const WAPs = this._astalNetwork.wifi.get_access_points();
        const dedupMap: Record<string, AstalNetwork.AccessPoint> = {};

        WAPs.forEach((item: AstalNetwork.AccessPoint) => {
            if (item.ssid !== null && !Object.prototype.hasOwnProperty.call(dedupMap, item.ssid)) {
                dedupMap[item.ssid] = item;
            }
        });

        return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
    }

    /**
     * Determines if a given access point is currently in the staging area.
     *
     * @param wap - The access point to check.
     * @returns True if the access point is in staging; otherwise, false.
     */
    private _isInStaging(wap: AstalNetwork.AccessPoint): boolean {
        const wapInStaging = this.staging.get();
        if (wapInStaging === undefined) {
            return false;
        }

        return wap.bssid === wapInStaging.bssid;
    }

    /**
     * Retrieves a list of filtered wireless access points by removing duplicates and excluding specific entries.
     *
     * @returns A filtered array of wireless access points.
     */
    public getFilteredWirelessAPs(): AstalNetwork.AccessPoint[] {
        const dedupedWAPs = this._dedupeWAPs();

        const filteredWAPs = dedupedWAPs
            .filter((ap: AstalNetwork.AccessPoint) => {
                return ap.ssid !== 'Unknown' && !this._isInStaging(ap);
            })
            .sort((a: AstalNetwork.AccessPoint, b: AstalNetwork.AccessPoint) => {
                if (this.isApActive(a)) {
                    return -1;
                }

                if (this.isApActive(b)) {
                    return 1;
                }

                return b.strength - a.strength;
            });

        return filteredWAPs;
    }

    /**
     * Determines whether the device is in an active state.
     *
     * @param state - The current state of the device.
     * @returns True if the device is in an active state; otherwise, false.
     */
    public isApEnabled(state: AstalNetwork.DeviceState | undefined): boolean {
        if (state === null) {
            return false;
        }

        return !(
            state === AstalNetwork.DeviceState.DISCONNECTED ||
            state === AstalNetwork.DeviceState.UNAVAILABLE ||
            state === AstalNetwork.DeviceState.FAILED
        );
    }

    /**
     * Checks if the given access point is the currently active one.
     *
     * @param accessPoint - The access point to check.
     * @returns True if the access point is active; otherwise, false.
     */
    public isApActive(accessPoint: AstalNetwork.AccessPoint): boolean {
        return accessPoint.ssid === this._astalNetwork.wifi?.activeAccessPoint?.ssid;
    }

    /**
     * Checks if the specified access point is in the process of disconnecting.
     *
     * @param accessPoint - The access point to check.
     * @returns True if the access point is disconnecting; otherwise, false.
     */
    public isDisconnecting(accessPoint: AstalNetwork.AccessPoint): boolean {
        if (this.isApActive(accessPoint)) {
            return this._astalNetwork.wifi?.state === AstalNetwork.DeviceState.DEACTIVATING;
        }
        return false;
    }

    /**
     * Retrieves the current Wi-Fi status based on the network service state.
     *
     * @returns A string representing the current Wi-Fi status.
     */
    public getWifiStatus(): string {
        const wifiState = this._astalNetwork.wifi?.state;

        if (wifiState !== null) {
            return DEVICE_STATES[wifiState];
        }
        return DEVICE_STATES[AstalNetwork.DeviceState.UNKNOWN];
    }

    /**
     * Initiates a connection to the specified access point.
     *
     * @param accessPoint - The access point to connect to.
     * @param event - The click event triggering the connection.
     */
    public connectToAP(accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void {
        if (
            accessPoint.bssid === this.connecting.get() ||
            this.isApActive(accessPoint) ||
            !isPrimaryClick(event)
        ) {
            return;
        }

        if (!accessPoint.flags || accessPoint.flags === AP_FLAGS.NONE) {
            this.connecting.set(accessPoint.bssid ?? '');

            execAsync(`nmcli device wifi connect ${accessPoint.bssid}`)
                .then(() => {
                    this.connecting.set('');
                    this.staging.set({} as AstalNetwork.AccessPoint);
                })
                .catch((err: Error) => {
                    this.connecting.set('');
                    SystemUtilities.notify({
                        summary: 'Network',
                        body: err.message,
                    });
                });
        } else {
            this.staging.set(accessPoint);
        }
    }

    /**
     * Connects to a secured access point with a password.
     *
     * @param accessPoint - The access point to connect to.
     * @param password - The password for the network.
     */
    public async connectToAPWithPassword(
        accessPoint: AstalNetwork.AccessPoint,
        password: string,
    ): Promise<void> {
        if (!accessPoint.ssid || !password) {
            return Promise.reject(new Error('SSID and password are required'));
        }

        this.connecting.set(accessPoint.bssid || '');

        const connectCommand = `nmcli device wifi connect "${accessPoint.ssid}" password "${password}"`;

        return execAsync(connectCommand)
            .then(() => {
                this.connecting.set('');
                this.staging.set(undefined);
            })
            .catch((err: Error) => {
                this.connecting.set('');
                throw err;
            });
    }

    /**
     * Disconnects from the specified access point.
     *
     * @param accessPoint - The access point to disconnect from.
     * @param event - The click event triggering the disconnection.
     */
    public disconnectFromAP(accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void {
        if (!isPrimaryClick(event)) {
            return;
        }

        this.connecting.set(accessPoint.bssid || '');
        execAsync('nmcli connection show --active').then((res: string) => {
            const connectionId = this._getIdFromSsid(accessPoint.ssid || '', res);

            if (connectionId === undefined) {
                console.error(`Error while disconnecting "${accessPoint.ssid}": Connection ID not found`);
                return;
            }

            execAsync(`nmcli connection down ${connectionId} "${accessPoint.ssid}"`)
                .then(() => {
                    this.connecting.set('');
                })
                .catch((err: unknown) => {
                    this.connecting.set('');
                    console.error(`Error while disconnecting "${accessPoint.ssid}": ${err}`);
                });
        });
    }

    /**
     * Forgets the specified access point by deleting its connection.
     *
     * @param accessPoint - The access point to forget.
     * @param event - The click event triggering the forget action.
     */
    public forgetAP(accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void {
        if (!isPrimaryClick(event)) {
            return;
        }
        this.connecting.set(accessPoint.bssid || '');
        execAsync('nmcli connection show --active').then((res: string) => {
            const connectionId = this._getIdFromSsid(accessPoint.ssid || '', res);

            if (connectionId === undefined) {
                console.error(`Error while forgetting "${accessPoint.ssid}": Connection ID not found`);
                return;
            }

            execAsync(`nmcli connection delete ${connectionId} "${accessPoint.ssid}"`)
                .then(() => {
                    this.connecting.set('');
                })
                .catch((err: unknown) => {
                    this.connecting.set('');
                    console.error(`Error while forgetting "${accessPoint.ssid}": ${err}`);
                });
        });
    }

    /**
     * Extracts the connection ID associated with a given SSID from the `nmcli` command output.
     *
     * @param ssid - The SSID of the network.
     * @param nmcliOutput - The output string from the `nmcli` command.
     * @returns The connection ID if found; otherwise, undefined.
     */
    private _getIdFromSsid(ssid: string, nmcliOutput: string): string | undefined {
        const lines = nmcliOutput.trim().split('\n');

        for (const line of lines) {
            const columns = line.trim().split(/\s{2,}/);

            if (columns[0].includes(ssid)) {
                return columns[1];
            }
        }
    }
}
