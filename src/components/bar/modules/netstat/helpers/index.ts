import GLib from 'gi://GLib';
import { Variable } from 'astal';
import { NetworkResourceData } from 'src/lib/types/customModules/network';
import { GET_DEFAULT_NETSTAT_DATA } from 'src/lib/types/defaults/netstat';
import { RateUnit } from 'src/lib/types/bar';

let previousNetUsage = { rx: 0, tx: 0, time: 0 };

interface NetworkUsage {
    name: string;
    rx: number;
    tx: number;
}

/**
 * Formats the network rate based on the provided rate, type, and rounding option.
 *
 * This function converts the network rate to the appropriate unit (KiB/s, MiB/s, GiB/s, or bytes/s) based on the provided type.
 * It also rounds the rate to the specified number of decimal places.
 *
 * @param rate The network rate to format.
 * @param type The unit type for the rate (KiB, MiB, GiB).
 * @param round A boolean indicating whether to round the rate.
 *
 * @returns The formatted network rate as a string.
 */
const formatRate = (rate: number, type: string, round: boolean): string => {
    const fixed = round ? 0 : 2;

    switch (true) {
        case type === 'KiB':
            return `${(rate / 1e3).toFixed(fixed)} KiB/s`;
        case type === 'MiB':
            return `${(rate / 1e6).toFixed(fixed)} MiB/s`;
        case type === 'GiB':
            return `${(rate / 1e9).toFixed(fixed)} GiB/s`;
        case rate >= 1e9:
            return `${(rate / 1e9).toFixed(fixed)} GiB/s`;
        case rate >= 1e6:
            return `${(rate / 1e6).toFixed(fixed)} MiB/s`;
        case rate >= 1e3:
            return `${(rate / 1e3).toFixed(fixed)} KiB/s`;
        default:
            return `${rate.toFixed(fixed)} bytes/s`;
    }
};

/**
 * Parses a line of network interface data.
 *
 * This function parses a line of network interface data from the /proc/net/dev file.
 * It extracts the interface name, received bytes, and transmitted bytes.
 *
 * @param line The line of network interface data to parse.
 *
 * @returns An object containing the interface name, received bytes, and transmitted bytes, or null if the line is invalid.
 */
const parseInterfaceData = (line: string): NetworkUsage | null => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('Inter-') || trimmedLine.startsWith('face')) {
        return null;
    }

    const [iface, rx, , , , , , , , tx] = trimmedLine.split(/\s+/);
    const rxValue = parseInt(rx, 10);
    const txValue = parseInt(tx, 10);
    const cleanedIface = iface.replace(':', '');

    return { name: cleanedIface, rx: rxValue, tx: txValue };
};

/**
 * Validates a network interface.
 *
 * This function checks if the provided network interface is valid based on the interface name and received/transmitted bytes.
 *
 * @param iface The network interface to validate.
 * @param interfaceName The name of the interface to check.
 *
 * @returns True if the interface is valid, false otherwise.
 */
const isValidInterface = (iface: NetworkUsage | null, interfaceName: string): boolean => {
    if (!iface) return false;
    if (interfaceName) return iface.name === interfaceName;
    return iface.name !== 'lo' && iface.rx > 0 && iface.tx > 0;
};

/**
 * Retrieves the network usage for a specified interface.
 *
 * This function reads the /proc/net/dev file to get the network usage data for the specified interface.
 * If no interface name is provided, it returns the usage data for the first valid interface found.
 *
 * @param interfaceName The name of the interface to get the usage data for. Defaults to an empty string.
 *
 * @returns An object containing the interface name, received bytes, and transmitted bytes.
 */
const getNetworkUsage = (interfaceName: string = ''): NetworkUsage => {
    const [success, data] = GLib.file_get_contents('/proc/net/dev');
    if (!success) {
        console.error('Failed to read /proc/net/dev');
        return { name: '', rx: 0, tx: 0 };
    }

    const lines = new TextDecoder('utf-8').decode(data).split('\n');
    for (const line of lines) {
        const iface = parseInterfaceData(line);
        if (isValidInterface(iface, interfaceName)) {
            return iface!;
        }
    }

    return { name: '', rx: 0, tx: 0 };
};

/**
 * Computes the network usage data.
 *
 * This function calculates the network usage data based on the provided rounding option, interface name, and data type.
 * It returns an object containing the formatted received and transmitted rates.
 *
 * @param round A Variable<boolean> indicating whether to round the rates.
 * @param interfaceNameVar A Variable<string> containing the name of the interface to get the usage data for.
 * @param dataType A Variable<RateUnit> containing the unit type for the rates.
 *
 * @returns An object containing the formatted received and transmitted rates.
 */
export const computeNetwork = (
    round: Variable<boolean>,
    interfaceNameVar: Variable<string>,
    dataType: Variable<RateUnit>,
): NetworkResourceData => {
    const rateUnit = dataType.get();
    const interfaceName = interfaceNameVar ? interfaceNameVar.get() : '';

    const DEFAULT_NETSTAT_DATA = GET_DEFAULT_NETSTAT_DATA(rateUnit);
    try {
        const { rx, tx, name } = getNetworkUsage(interfaceName);
        const currentTime = Date.now();

        if (!name) {
            return DEFAULT_NETSTAT_DATA;
        }

        if (previousNetUsage.time === 0) {
            previousNetUsage = { rx, tx, time: currentTime };
            return DEFAULT_NETSTAT_DATA;
        }

        const timeDiff = Math.max((currentTime - previousNetUsage.time) / 1000, 1);
        const rxRate = (rx - previousNetUsage.rx) / timeDiff;
        const txRate = (tx - previousNetUsage.tx) / timeDiff;

        previousNetUsage = { rx, tx, time: currentTime };

        return {
            in: formatRate(rxRate, rateUnit, round.get()),
            out: formatRate(txRate, rateUnit, round.get()),
        };
    } catch (error) {
        console.error('Error calculating network usage:', error);
        return DEFAULT_NETSTAT_DATA;
    }
};
