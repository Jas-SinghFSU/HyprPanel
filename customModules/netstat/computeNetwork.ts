import GLib from 'gi://GLib';
import { Variable as VariableType } from 'types/variable';
import { NetworkResourceData } from 'lib/types/customModules/network';
import { GET_DEFAULT_NETSTAT_DATA } from 'lib/types/defaults/netstat';
import { RateUnit } from 'lib/types/bar';

let previousNetUsage = { rx: 0, tx: 0, time: 0 };

const formatRate = (rate: number, type: string, round: boolean): string => {
    const fixed = round ? 0 : 2;

    if (type === 'KiB') return `${(rate / 1e3).toFixed(fixed)} KiB/s`;
    if (type === 'MiB') return `${(rate / 1e6).toFixed(fixed)} MiB/s`;
    if (type === 'GiB') return `${(rate / 1e9).toFixed(fixed)} GiB/s`;

    if (rate >= 1e9) return `${(rate / 1e9).toFixed(fixed)} GiB/s`;
    if (rate >= 1e6) return `${(rate / 1e6).toFixed(fixed)} MiB/s`;
    if (rate >= 1e3) return `${(rate / 1e3).toFixed(fixed)} KiB/s`;

    return `${rate.toFixed(fixed)} bytes/s`;
};

interface NetworkUsage {
    name: string | null;
    rx: number;
    tx: number;
}

const getNetworkUsage = (interfaceName: string | null = null): NetworkUsage => {
    const [success, data] = GLib.file_get_contents('/proc/net/dev');

    if (!success) {
        console.error('Failed to read /proc/net/dev');
        return { name: null, rx: 0, tx: 0 };
    }

    const lines = new TextDecoder('utf-8').decode(data).split('\n');
    let activeInterface: NetworkUsage | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('Inter-') && !trimmedLine.startsWith('face')) {
            const [iface, rx, , , , , , , , tx] = trimmedLine.split(/\s+/);
            if ((interfaceName && iface.replace(':', '') === interfaceName) || (!interfaceName && iface !== 'lo')) {
                activeInterface = { name: iface.replace(':', ''), rx: parseInt(rx, 10), tx: parseInt(tx, 10) };
                if (interfaceName) break;
            }
        }
    }

    return activeInterface || { name: null, rx: 0, tx: 0 };
};

export const computeNetwork = (round: VariableType<boolean>, interfaceName: string, dataType: RateUnit): NetworkResourceData => {
    const DEFAULT_NETSTAT_DATA = GET_DEFAULT_NETSTAT_DATA(dataType);
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

        let timeDiff = (currentTime - previousNetUsage.time) / 1000;

        if (timeDiff <= 0) timeDiff = 1;

        const rxRate = (rx - previousNetUsage.rx) / timeDiff;
        const txRate = (tx - previousNetUsage.tx) / timeDiff;

        previousNetUsage = { rx, tx, time: currentTime };

        const inFormatted = formatRate(rxRate, dataType, round.value);
        const outFormatted = formatRate(txRate, dataType, round.value);

        return {
            in: inFormatted,
            out: outFormatted,
        };
    } catch (error) {
        console.error('Error calculating network usage:', error);
        return DEFAULT_NETSTAT_DATA;
    }
};

