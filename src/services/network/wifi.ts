import { bind, Variable, GLib } from 'astal';
import { Astal } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import NM from 'gi://NM?version=1.0';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { isPrimaryClick } from 'src/lib/events/mouse';
import {
    AP_FLAGS,
    AP_SEC_FLAGS,
    SecurityType,
    DEVICE_STATES,
    ErrorType,
    AUTH_STATE_REASONS,
    AUTH_DEVICE_REASONS,
    DEVICE_STATE_REASONS,
    CONNECTION_ERROR_MESSAGES,
} from './types';

/**
 * WifiManager handles all WiFi-related functionality for staging and connecting to
 * wireless networks
 */
export class WifiManager {
    private _astalNetwork: AstalNetwork.Network;
    private _nmClient: NM.Client;

    public isWifiEnabled: Variable<boolean> = Variable(false);
    public isScanning: Variable<boolean> = Variable(false);
    public wifiAccessPoints: Variable<AstalNetwork.AccessPoint[]> = Variable([]);
    public staging = Variable<AstalNetwork.AccessPoint | undefined>(undefined);
    public connecting = Variable<string>('');
    public savedNetworks: Variable<string[]> = Variable([]);
    public activeConnectionState: Variable<number> = Variable(0);

    private _wifiEnabledBinding: Variable<void> | undefined;
    private _scanningBinding: Variable<void> | undefined;
    private _accessPointBinding: Variable<void> | undefined;

    constructor(networkService: AstalNetwork.Network) {
        this._astalNetwork = networkService;
        this._nmClient = networkService.client;
        this._setupNMSignals();
        this._updateSavedNetworksFromNM();
    }

    /**
     * Sets up NetworkManager D-Bus signal subscriptions for real-time updates.
     * This eliminates the need for polling saved networks.
     */
    private _setupNMSignals(): void {
        this._nmClient.connect('connection-added', () => {
            this._updateSavedNetworksFromNM();
        });

        this._nmClient.connect('connection-removed', () => {
            this._updateSavedNetworksFromNM();
        });

        this._nmClient.connect('active-connection-added', () => {
            this.activeConnectionState.set(this.activeConnectionState.get() + 1);
        });

        this._nmClient.connect('active-connection-removed', () => {
            this.activeConnectionState.set(this.activeConnectionState.get() + 1);
        });

        if (this._astalNetwork.wifi) {
            this._astalNetwork.wifi.connect('notify::active-access-point', () => {
                this.activeConnectionState.set(this.activeConnectionState.get() + 1);
            });

            this._astalNetwork.wifi.connect('notify::state', () => {
                this.activeConnectionState.set(this.activeConnectionState.get() + 1);
            });
        }
    }

    /**
     * Called when the WiFi service changes to update bindings
     */
    public onWifiServiceChanged(): void {
        this._wifiEnabled();
        this._scanningStatus();
        this._accessPoints();
        this._updateSavedNetworksFromNM();
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

                const aIsSaved = this.isSavedNetwork(a.ssid || '');
                const bIsSaved = this.isSavedNetwork(b.ssid || '');

                if (aIsSaved && !bIsSaved) {
                    return -1;
                }

                if (!aIsSaved && bIsSaved) {
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
     * Updates the list of saved network connections from NetworkManager.
     * This method is called automatically when connections are added/removed.
     */
    private _updateSavedNetworksFromNM(): void {
        try {
            const connections = this._nmClient.get_connections();
            const wifiNetworks = connections
                .filter((c) => c.get_connection_type() === '802-11-wireless')
                .map((c) => c.get_id())
                .filter((name) => name && name.length > 0);

            this.savedNetworks.set(wifiNetworks);
        } catch (err) {
            console.error('Error refreshing saved networks from NM:', err);
            this.savedNetworks.set([]);
        }
    }

    /**
     * Checks if a given SSID has a saved connection profile.
     *
     * @param ssid - The SSID to check.
     * @returns True if the network is saved; otherwise, false.
     */
    public isSavedNetwork(ssid: string): boolean {
        return this.savedNetworks.get().includes(ssid);
    }

    /**
     * Gets the WiFi device from NetworkManager.
     *
     * @returns The NM.DeviceWifi instance or null if not found.
     */
    private _getWifiDevice(): NM.DeviceWifi | null {
        const devices = this._nmClient.get_devices();
        const wifiDevice = devices.find((d) => d.get_device_type() === NM.DeviceType.WIFI);
        return (wifiDevice as NM.DeviceWifi) || null;
    }

    /**
     * Gets the D-Bus object path for an access point.
     * Maps AstalNetwork.AccessPoint to NM.AccessPoint by BSSID.
     *
     * @param accessPoint - The AstalNetwork access point.
     * @returns The D-Bus object path or null if not found.
     */
    private _getAPPath(accessPoint: AstalNetwork.AccessPoint): string | null {
        const wifiDevice = this._getWifiDevice();
        if (!wifiDevice) {
            return null;
        }

        const nmAPs = wifiDevice.get_access_points();
        const nmAP = nmAPs.find((ap) => ap.get_bssid() === accessPoint.bssid);
        return nmAP?.get_path() || null;
    }

    /**
     * Detects the security type of an access point.
     *
     * @param accessPoint - The access point to check.
     * @returns The security type of the network.
     */
    private _detectSecurityType(accessPoint: AstalNetwork.AccessPoint): SecurityType {
        const { flags, wpaFlags, rsnFlags } = accessPoint;

        if (rsnFlags && rsnFlags !== 0) {
            if (rsnFlags & AP_SEC_FLAGS.KEY_MGMT_SAE) {
                return SecurityType.WPA3_SAE;
            }
            if (rsnFlags & (AP_SEC_FLAGS.KEY_MGMT_OWE | AP_SEC_FLAGS.KEY_MGMT_OWE_TM)) {
                return SecurityType.OWE;
            }
            if (rsnFlags & AP_SEC_FLAGS.KEY_MGMT_802_1X) {
                return SecurityType.WPA_ENTERPRISE;
            }
            if (rsnFlags & AP_SEC_FLAGS.KEY_MGMT_PSK) {
                return SecurityType.WPA_PSK;
            }
        }

        if (wpaFlags && wpaFlags !== 0) {
            if (wpaFlags & AP_SEC_FLAGS.KEY_MGMT_802_1X) {
                return SecurityType.WPA_ENTERPRISE;
            }
            if (wpaFlags & AP_SEC_FLAGS.KEY_MGMT_PSK) {
                return SecurityType.WPA_PSK;
            }
        }

        if (flags && flags & AP_FLAGS.PRIVACY) {
            return SecurityType.WEP;
        }

        return SecurityType.OPEN;
    }

    /**
     * Determines if an access point requires a password for connection.
     *
     * @param accessPoint - The access point to check.
     * @returns True if password is required, false for open/OWE networks.
     */
    private _requiresPassword(accessPoint: AstalNetwork.AccessPoint): boolean {
        const securityType = this._detectSecurityType(accessPoint);
        return securityType !== SecurityType.OPEN && securityType !== SecurityType.OWE;
    }

    /**
     * Deactivates a connection by SSID.
     *
     * @param ssid - The SSID of the network to disconnect from.
     * @returns Promise that resolves when disconnection is complete.
     */
    private async _deactivateConnection(ssid: string): Promise<void> {
        const activeConns = this._nmClient.get_active_connections();
        const activeConn = activeConns.find((ac: NM.ActiveConnection) => ac.get_id() === ssid);

        if (!activeConn) {
            return; // No active connection to disconnect
        }

        return new Promise<void>((resolve, reject) => {
            this._nmClient.deactivate_connection_async(
                activeConn,
                null,
                (client: NM.Client | null, result) => {
                    try {
                        if (client) {
                            client.deactivate_connection_finish(result);
                        }
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                },
            );
        });
    }

    /**
     * Activates an existing saved connection.
     *
     * @param ssid - The SSID of the network to activate.
     */
    private async _activateExistingConnection(ssid: string): Promise<void> {
        const connection = this._nmClient.get_connection_by_id(ssid);

        if (!connection) {
            throw new Error('Connection not found');
        }

        // Disconnect from current network if switching to a different one
        const currentSsid = this._astalNetwork.wifi?.activeAccessPoint?.ssid;
        if (currentSsid && currentSsid !== ssid) {
            await this._deactivateConnection(currentSsid);
        }

        return new Promise<void>((resolve, reject) => {
            this._nmClient.activate_connection_async(
                connection,
                null, // device (auto-select)
                null, // specific_object (AP path)
                null, // cancellable
                (client: NM.Client | null, result) => {
                    try {
                        if (client) {
                            client.activate_connection_finish(result);
                        }
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                },
            );
        });
    }

    /**
     * Connects to an open WiFi network.
     *
     * @param accessPoint - The access point to connect to.
     */
    private async _connectToOpenNetwork(accessPoint: AstalNetwork.AccessPoint): Promise<void> {
        const connection = NM.SimpleConnection.new();
        const ssid = accessPoint.ssid;

        if (!ssid) {
            throw new Error('SSID is required');
        }

        const settingConn = NM.SettingConnection.new();
        settingConn.id = ssid;
        settingConn.type = '802-11-wireless';
        settingConn.uuid = NM.utils_uuid_generate();
        connection.add_setting(settingConn);

        const settingWireless = NM.SettingWireless.new();
        const ssidBytes = new TextEncoder().encode(ssid);
        settingWireless.ssid = GLib.Bytes.new(ssidBytes);
        connection.add_setting(settingWireless);

        const settingIP4 = NM.SettingIP4Config.new();
        settingIP4.method = 'auto';
        connection.add_setting(settingIP4);

        const settingIP6 = NM.SettingIP6Config.new();
        settingIP6.method = 'auto';
        connection.add_setting(settingIP6);

        const wifiDevice = this._getWifiDevice();
        const apPath = this._getAPPath(accessPoint);

        if (!wifiDevice) {
            throw new Error('WiFi device not found');
        }

        return new Promise<void>((resolve, reject) => {
            this._nmClient.add_and_activate_connection_async(
                connection,
                wifiDevice,
                apPath,
                null,
                (client: NM.Client | null, result) => {
                    try {
                        if (client) {
                            client.add_and_activate_connection_finish(result);
                        }
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                },
            );
        });
    }

    /**
     * Initiates a connection to the specified access point.
     * If a saved connection exists, it will be activated.
     * For new WPA-Enterprise networks, shows "not supported" message.
     * For new secured networks, opens password prompt.
     * For new open networks, connects immediately.
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

        const ssid = accessPoint.ssid;
        if (!ssid) {
            return;
        }

        if (this.isSavedNetwork(ssid)) {
            this.connecting.set(accessPoint.bssid ?? '');
            this._activateExistingConnection(ssid)
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
            return;
        }

        const securityType = this._detectSecurityType(accessPoint);

        if (securityType === SecurityType.WPA_ENTERPRISE) {
            SystemUtilities.notify({
                summary: 'Network',
                body: 'WPA-Enterprise networks are not supported at the moment.',
            });
            return;
        }

        if (this._requiresPassword(accessPoint)) {
            this.staging.set(accessPoint);
            return;
        }

        this.connecting.set(accessPoint.bssid ?? '');
        this._connectToOpenNetwork(accessPoint)
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
    }

    /**
     * Connects to a secured access point with a password via D-Bus.
     * Supports WEP, WPA-PSK, WPA2-PSK, and WPA3-SAE.
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
        const ssid = accessPoint.ssid;
        const securityType = this._detectSecurityType(accessPoint);

        try {
            const wifiDevice = this._getWifiDevice();
            const apPath = this._getAPPath(accessPoint);

            if (!wifiDevice || !apPath) {
                throw new Error('WiFi device or access point not found');
            }

            if (securityType === SecurityType.WEP) {
                SystemUtilities.notify({
                    summary: 'Security Warning',
                    body: 'WEP encryption is deprecated and insecure. Consider upgrading your router to WPA2/WPA3.',
                });
            }

            const connection = NM.SimpleConnection.new();

            const settingConn = NM.SettingConnection.new();
            settingConn.id = ssid;
            settingConn.type = '802-11-wireless';
            settingConn.uuid = NM.utils_uuid_generate();
            connection.add_setting(settingConn);

            const settingWireless = NM.SettingWireless.new();
            const ssidBytes = new TextEncoder().encode(ssid);
            settingWireless.ssid = GLib.Bytes.new(ssidBytes);
            connection.add_setting(settingWireless);

            const settingSecurity = NM.SettingWirelessSecurity.new();

            if (securityType === SecurityType.WEP) {
                settingSecurity.key_mgmt = 'none';
                settingSecurity.auth_alg = 'open';
                settingSecurity.wep_key0 = password;
                settingSecurity.wep_tx_keyidx = 0;
            } else if (securityType === SecurityType.WPA3_SAE) {
                settingSecurity.key_mgmt = 'sae';
                settingSecurity.psk = password;
            } else {
                settingSecurity.key_mgmt = 'wpa-psk';
                settingSecurity.psk = password;
            }

            connection.add_setting(settingSecurity);

            const settingIP4 = NM.SettingIP4Config.new();
            settingIP4.method = 'auto';
            connection.add_setting(settingIP4);

            const settingIP6 = NM.SettingIP6Config.new();
            settingIP6.method = 'auto';
            connection.add_setting(settingIP6);

            const activeConnection = await new Promise<NM.ActiveConnection>((resolve, reject) => {
                this._nmClient.add_and_activate_connection_async(
                    connection,
                    wifiDevice,
                    apPath,
                    null,
                    (client: NM.Client | null, result) => {
                        try {
                            if (client) {
                                const activeConn = client.add_and_activate_connection_finish(result);
                                resolve(activeConn);
                            } else {
                                reject(new Error('NetworkManager client is null'));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    },
                );
            });

            await this._waitForConnectionState(activeConnection);

            this.connecting.set('');
            this.staging.set(undefined);
        } catch (err: unknown) {
            this.connecting.set('');

            const failedConn = this._nmClient.get_connection_by_id(ssid);
            if (failedConn) {
                failedConn.delete_async(null, () => {});
            }

            this._handleConnectionError(err, ssid, accessPoint);
            throw err;
        }
    }

    /**
     * Classifies a NetworkManager state reason into an error type.
     *
     * @param stateReason - The NM.ActiveConnectionStateReason code.
     * @returns The error type and user-friendly message.
     */
    private _classifyConnectionError(stateReason: NM.ActiveConnectionStateReason): {
        type: ErrorType;
        message: string;
    } {
        if (AUTH_STATE_REASONS.includes(stateReason)) {
            return { type: ErrorType.AUTHENTICATION, message: 'Incorrect password.' };
        }

        if (stateReason === NM.ActiveConnectionStateReason.CONNECT_TIMEOUT) {
            return { type: ErrorType.TIMEOUT, message: 'Connection timeout.' };
        }

        if (DEVICE_STATE_REASONS.includes(stateReason)) {
            return { type: ErrorType.DEVICE, message: 'Device disconnected.' };
        }

        return {
            type: ErrorType.OTHER,
            message:
                CONNECTION_ERROR_MESSAGES[stateReason] || `Connection failed (error code: ${stateReason}).`,
        };
    }

    /**
     * Checks if a device disconnection was caused by authentication failure.
     *
     * @param activeConnection - The active connection.
     * @returns True if authentication failed.
     */
    private _isDeviceAuthFailure(activeConnection: NM.ActiveConnection): boolean {
        const device = activeConnection.get_devices()[0] as NM.DeviceWifi | undefined;
        if (!device) {
            return false;
        }

        const deviceStateReason = device.get_state_reason();
        return AUTH_DEVICE_REASONS.includes(deviceStateReason);
    }

    /**
     * Waits for an active connection to reach ACTIVATED state or fail.
     * This is necessary because add_and_activate returns before authentication completes.
     *
     * @param activeConnection - The active connection to monitor.
     * @param ssid - The SSID for error messages.
     */
    private async _waitForConnectionState(activeConnection: NM.ActiveConnection): Promise<void> {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-const
            let timeoutId: number | undefined;
            // eslint-disable-next-line prefer-const
            let stateHandlerId: number | undefined;

            const cleanup = (): void => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (stateHandlerId && activeConnection) {
                    activeConnection.disconnect(stateHandlerId);
                }
            };

            // Set timeout for connection attempt (30 seconds)
            timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('Connection timeout'));
            }, 30000) as unknown as number;

            // Monitor state changes
            stateHandlerId = activeConnection.connect('notify::state', () => {
                const state = activeConnection.get_state();

                if (state === NM.ActiveConnectionState.ACTIVATED) {
                    cleanup();
                    resolve();
                } else if (
                    state === NM.ActiveConnectionState.DEACTIVATED ||
                    state === NM.ActiveConnectionState.DEACTIVATING
                ) {
                    cleanup();
                    const stateReason = activeConnection.get_state_reason();
                    let errorResult = this._classifyConnectionError(stateReason);

                    // Device disconnections may be authentication failures - check device state
                    if (
                        errorResult.type === ErrorType.DEVICE &&
                        this._isDeviceAuthFailure(activeConnection)
                    ) {
                        errorResult = { type: ErrorType.AUTHENTICATION, message: 'Incorrect password.' };
                    }

                    reject(new Error(errorResult.message));
                }
            }) as unknown as number;
        });
    }

    /**
     * Determines if an error message indicates an authentication failure.
     *
     * @param errorMessage - The error message to check.
     * @returns True if authentication failed.
     */
    private _isAuthenticationError(errorMessage: string): boolean {
        const authKeywords = ['incorrect password', 'authentication', 'secret', 'password'];
        const lowerMessage = errorMessage.toLowerCase();
        return authKeywords.some((keyword) => lowerMessage.includes(keyword));
    }

    /**
     * Handles connection errors and provides user-friendly feedback.
     *
     * @param err - The error object.
     * @param ssid - The SSID of the network.
     * @param accessPoint - The access point being connected to.
     */
    private _handleConnectionError(err: unknown, ssid: string, accessPoint: AstalNetwork.AccessPoint): void {
        const error = err as Error;
        const errorMessage = error.message || 'Unknown error';

        // Re-stage access point for password retry on authentication failures
        if (this._isAuthenticationError(errorMessage)) {
            this.staging.set(accessPoint);
        }

        SystemUtilities.notify({
            summary: 'Failed to connect',
            body: `"${ssid}": ${errorMessage}`,
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

        const ssid = accessPoint.ssid;
        if (!ssid) {
            return;
        }

        this.connecting.set(accessPoint.bssid || '');

        this._deactivateConnection(ssid)
            .then(() => {
                this.connecting.set('');
            })
            .catch((err: Error) => {
                this.connecting.set('');
                console.error(`Error while disconnecting "${ssid}": ${err.message}`);
                SystemUtilities.notify({
                    summary: 'Failed to disconnect',
                    body: `"${ssid}": ${err.message}`,
                });
            });
    }

    /**
     * Forgets the specified access point by deleting its connection.
     * Works with both active and saved (inactive) networks.
     *
     * @param accessPoint - The access point to forget.
     * @param event - The click event triggering the forget action.
     */
    public forgetAP(accessPoint: AstalNetwork.AccessPoint, event: Astal.ClickEvent): void {
        if (!isPrimaryClick(event)) {
            return;
        }

        const ssid = accessPoint.ssid;
        if (!ssid) {
            return;
        }

        this.connecting.set(accessPoint.bssid || '');

        // Find connection by SSID
        const connection = this._nmClient.get_connection_by_id(ssid);

        if (!connection) {
            this.connecting.set('');
            console.error(`Error while forgetting "${ssid}": Connection not found`);
            SystemUtilities.notify({
                summary: 'Failed to remove network',
                body: `"${ssid}": Connection not found`,
            });
            return;
        }

        // Delete connection
        connection.delete_async(null, (conn: NM.RemoteConnection | null, result) => {
            try {
                if (conn) {
                    conn.delete_finish(result);
                }
                this.connecting.set('');
                SystemUtilities.notify({
                    summary: 'Network',
                    body: `Removed saved network "${ssid}"`,
                });
            } catch (err) {
                this.connecting.set('');
                const error = err as Error;
                console.error(`Error while forgetting "${ssid}": ${error.message}`);
                SystemUtilities.notify({
                    summary: 'Failed to remove network',
                    body: `Failed to remove "${ssid}": ${error.message}`,
                });
            }
        });
    }
}
