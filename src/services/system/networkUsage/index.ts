import { bind, Variable } from 'astal';
import GLib from 'gi://GLib';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { ByteMultiplier, NetworkResourceData, RateUnit } from '../types';
import { NetworkServiceCtor, NetworkUsage } from './types';

/**
 * Service for monitoring network interface traffic and bandwidth usage
 */
class NetworkUsageService {
    private _updateFrequency: Variable<number>;
    private _shouldRound = false;
    private _interfaceName = Variable('');
    private _rateUnit = Variable<RateUnit>('auto');

    private _previousNetUsage = { rx: 0, tx: 0, time: 0 };
    private _networkPoller: FunctionPoller<NetworkResourceData, []>;
    private _isInitialized = false;

    public _network: Variable<NetworkResourceData>;

    constructor({ frequency }: NetworkServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        const defaultNetstatData = this._getDefaultNetstatData(this._rateUnit.get());
        this._network = Variable<NetworkResourceData>(defaultNetstatData);

        this._calculateUsage = this._calculateUsage.bind(this);

        this._networkPoller = new FunctionPoller<NetworkResourceData, []>(
            this._network,
            [],
            bind(this._updateFrequency),
            this._calculateUsage,
        );
    }

    /**
     * Manually refreshes the network usage statistics
     */
    public refresh(): void {
        this._network.set(this._calculateUsage());
    }

    /**
     * Gets the network usage data variable
     *
     * @returns Variable containing incoming and outgoing network rates
     */
    public get network(): Variable<NetworkResourceData> {
        return this._network;
    }

    /**
     * Calculates network usage rates for the configured interface
     */
    private _calculateUsage(): NetworkResourceData {
        const rateUnit = this._rateUnit.get();
        const interfaceName = this._interfaceName.get();

        const DEFAULT_NETSTAT_DATA = this._getDefaultNetstatData(rateUnit);

        try {
            const { rx, tx, name } = this._getNetworkUsage(interfaceName);
            const currentTime = Date.now();

            if (!name) {
                return DEFAULT_NETSTAT_DATA;
            }

            if (this._previousNetUsage.time === 0) {
                this._previousNetUsage = { rx, tx, time: currentTime };
                return DEFAULT_NETSTAT_DATA;
            }

            const timeDiff = Math.max((currentTime - this._previousNetUsage.time) / 1000, 0.001);
            const rxRate = (rx - this._previousNetUsage.rx) / timeDiff;
            const txRate = (tx - this._previousNetUsage.tx) / timeDiff;

            this._previousNetUsage = { rx, tx, time: currentTime };

            return {
                in: this._formatRate(rxRate, rateUnit, this._shouldRound),
                out: this._formatRate(txRate, rateUnit, this._shouldRound),
            };
        } catch (error) {
            console.error('Error calculating network usage:', error);
            return DEFAULT_NETSTAT_DATA;
        }
    }

    /**
     * Sets the network interface to monitor
     *
     * @param interfaceName - Name of the network interface (e.g., 'eth0', 'wlan0')
     */
    public setInterface(interfaceName: string): void {
        this._interfaceName.set(interfaceName);
        this._resetUsageHistory();
    }

    /**
     * Sets the rate unit for formatting network speeds
     *
     * @param unit - Unit to display rates in ('auto', 'KiB', 'MiB', 'GiB')
     */
    public setRateUnit(unit: RateUnit): void {
        this._rateUnit.set(unit);
    }

    /**
     * Sets whether to round the rates to whole numbers
     *
     * @param round - Whether to round rates to integers
     */
    public setShouldRound(round: boolean): void {
        this._shouldRound = round;
    }

    /**
     * Updates the polling frequency
     *
     * @param timerInMs - New polling interval in milliseconds
     */
    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    /**
     * Initializes the network usage monitoring poller
     */
    public initialize(): void {
        if (!this._isInitialized) {
            this._networkPoller.initialize();
            this._isInitialized = true;
        }
    }

    /**
     * Stops the network monitoring poller
     */
    public stopPoller(): void {
        this._networkPoller.stop();
    }

    /**
     * Starts the network monitoring poller
     */
    public startPoller(): void {
        this._networkPoller.start();
    }

    /**
     * Resets the usage history for accurate rate calculation
     */
    private _resetUsageHistory(): void {
        this._previousNetUsage = { rx: 0, tx: 0, time: 0 };
    }

    /**
     * Formats the network rate based on the provided rate, type, and rounding option
     *
     * @param rate - Raw rate in bytes per second
     * @param type - Unit type to format to
     * @param round - Whether to round to whole numbers
     * @returns Formatted rate string with unit suffix
     */
    private _formatRate(rate: number, type: RateUnit, round: boolean): string {
        const fixed = round ? 0 : 2;

        switch (true) {
            case type === 'KiB':
                return `${(rate / ByteMultiplier.KIBIBYTE).toFixed(fixed)} KiB/s`;
            case type === 'MiB':
                return `${(rate / ByteMultiplier.MEBIBYTE).toFixed(fixed)} MiB/s`;
            case type === 'GiB':
                return `${(rate / ByteMultiplier.GIBIBYTE).toFixed(fixed)} GiB/s`;
            case rate >= ByteMultiplier.GIBIBYTE:
                return `${(rate / ByteMultiplier.GIBIBYTE).toFixed(fixed)} GiB/s`;
            case rate >= ByteMultiplier.MEBIBYTE:
                return `${(rate / ByteMultiplier.MEBIBYTE).toFixed(fixed)} MiB/s`;
            case rate >= ByteMultiplier.KIBIBYTE:
                return `${(rate / ByteMultiplier.KIBIBYTE).toFixed(fixed)} KiB/s`;
            case rate >= ByteMultiplier.BYTE:
            default:
                return `${rate.toFixed(fixed)} bytes/s`;
        }
    }

    /**
     * Parses a line of network interface data from /proc/net/dev
     *
     * @param line - Raw line from /proc/net/dev
     * @returns Parsed network usage data or null if invalid
     */
    private _parseInterfaceData(line: string): NetworkUsage | null {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('Inter-') || trimmedLine.startsWith('face')) {
            return null;
        }

        const [iface, rx, , , , , , , , tx] = trimmedLine.split(/\s+/);
        const rxValue = parseInt(rx, 10);
        const txValue = parseInt(tx, 10);
        const cleanedIface = iface.replace(':', '');

        return { name: cleanedIface, rx: rxValue, tx: txValue };
    }

    /**
     * Validates a network interface for monitoring
     *
     * @param iface - Interface data to validate
     * @param interfaceName - Specific interface name to match (empty for auto)
     * @returns Whether the interface is valid for monitoring
     */
    private _isValidInterface(iface: NetworkUsage | null, interfaceName: string): boolean {
        if (!iface) return false;
        if (interfaceName) return iface.name === interfaceName;

        return iface.name !== 'lo' && iface.rx > 0 && iface.tx > 0;
    }

    /**
     * Retrieves network usage for the specified interface from /proc/net/dev
     *
     * @param interfaceName - Name of interface to monitor (empty for auto-detect)
     * @returns Network usage statistics
     */
    private _getNetworkUsage(interfaceName: string = ''): NetworkUsage {
        const [success, data] = GLib.file_get_contents('/proc/net/dev');
        const defaultStats = { name: '', rx: 0, tx: 0 };

        if (!success) {
            console.error('Failed to read /proc/net/dev');
            return defaultStats;
        }

        const lines = new TextDecoder('utf-8').decode(data).split('\n');

        for (const line of lines) {
            const iface = this._parseInterfaceData(line);

            if (this._isValidInterface(iface, interfaceName)) {
                return iface ?? defaultStats;
            }
        }

        return { name: '', rx: 0, tx: 0 };
    }

    /**
     * Gets default network statistics data for initialization
     *
     * @param dataType - Rate unit type
     * @returns Default network resource data
     */
    private _getDefaultNetstatData = (dataType: RateUnit): NetworkResourceData => {
        if (dataType === 'auto') {
            return { in: '0 Kib/s', out: '0 Kib/s' };
        }

        return { in: `0 ${dataType}/s`, out: `0 ${dataType}/s` };
    };

    /**
     * Cleans up resources and stops monitoring
     */
    public destroy(): void {
        this._networkPoller.stop();
        this._network.drop();
        this._interfaceName.drop();
        this._rateUnit.drop();
        this._updateFrequency.drop();
    }
}

export default NetworkUsageService;
