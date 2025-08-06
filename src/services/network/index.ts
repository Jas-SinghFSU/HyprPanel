import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { WifiManager } from './wifi';
import { EthernetManager } from './ethernet';
import { WifiIcon, wifiIconMap } from './types';

/**
 * NetworkService consolidates all network-related functionality from various components
 * into a single service for better organization and maintainability.
 */
export class NetworkService {
    private static _instance: NetworkService;
    private _astalNetwork: AstalNetwork.Network;

    public wifi: WifiManager;
    public ethernet: EthernetManager;

    private constructor() {
        this._astalNetwork = AstalNetwork.get_default();
        this.wifi = new WifiManager(this._astalNetwork);
        this.ethernet = new EthernetManager(this._astalNetwork);

        this._setupBindings();
    }

    /**
     * Gets the singleton instance of NetworkService
     *
     * @returns The NetworkService instance
     */
    public static getInstance(): NetworkService {
        if (!this._instance) {
            this._instance = new NetworkService();
        }
        return this._instance;
    }

    /**
     * Retrieves the appropriate WiFi icon based on the provided icon name.
     *
     * @param iconName - The name of the icon to look up. If not provided, a default icon is returned.
     * @returns The corresponding WiFi icon as a string.
     */
    public getWifiIcon(iconName?: string): WifiIcon {
        if (iconName === undefined) {
            return '󰤫';
        }

        const wifiIcon = wifiIconMap.get(iconName.toLowerCase());

        if (wifiIcon) {
            return wifiIcon;
        }

        return '󰤨';
    }

    /**
     * Sets up bindings to monitor network service changes
     */
    private _setupBindings(): void {
        Variable.derive([bind(this._astalNetwork, 'wifi')], () => {
            this.wifi.onWifiServiceChanged();
        });

        Variable.derive([bind(this._astalNetwork, 'wired')], () => {
            this.ethernet.onWiredServiceChanged();
        });
    }
}
