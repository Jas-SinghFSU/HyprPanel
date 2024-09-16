import GLib from 'gi://GLib';
import { Variable as VariableType } from 'types/variable';
import { NetworkResourceData } from 'lib/types/customModules/network';
import { GET_DEFAULT_NETSTAT_DATA } from 'lib/types/defaults/netstat';
import { RateUnit } from 'lib/types/bar';

let previousNetUsage = { rx: 0, tx: 0, time: 0 };

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

interface NetworkUsage {
    name: string;
    rx: number;
    tx: number;
}

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

const isValidInterface = (iface: NetworkUsage | null, interfaceName: string): boolean => {
    if (!iface) return false;
    if (interfaceName) return iface.name === interfaceName;
    return iface.name !== 'lo' && iface.rx > 0 && iface.tx > 0;
};

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

export const computeNetwork = (
    round: VariableType<boolean>,
    interfaceNameVar: VariableType<string>,
    dataType: VariableType<RateUnit>,
): NetworkResourceData => {
    const rateUnit = dataType.value;
    const interfaceName = interfaceNameVar ? interfaceNameVar.value : '';

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
            in: formatRate(rxRate, rateUnit, round.value),
            out: formatRate(txRate, rateUnit, round.value),
        };
    } catch (error) {
        console.error('Error calculating network usage:', error);
        return DEFAULT_NETSTAT_DATA;
    }
};
