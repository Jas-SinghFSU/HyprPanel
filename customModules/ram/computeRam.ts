const GLib = imports.gi.GLib;
import { Variable as VariableType } from 'types/variable';

export const calculateRamUsage = (round: VariableType<boolean>) => {
    try {
        const [success, meminfoBytes] = GLib.file_get_contents('/proc/meminfo');

        if (!success || !meminfoBytes) {
            throw new Error('Failed to read /proc/meminfo or file content is null.');
        }

        const meminfo = new TextDecoder('utf-8').decode(meminfoBytes);

        const totalMatch = meminfo.match(/MemTotal:\s+(\d+)/);
        const availableMatch = meminfo.match(/MemAvailable:\s+(\d+)/);

        if (!totalMatch || !availableMatch) {
            throw new Error('Failed to parse /proc/meminfo for memory values.');
        }

        const totalRamInBytes = parseInt(totalMatch[1], 10) * 1024;
        const availableRamInBytes = parseInt(availableMatch[1], 10) * 1024;

        const usedRam = totalRamInBytes - availableRamInBytes;

        const divide = ([total, used]) => {
            return total > 0 ? Math.round((used / total) * 100) : 0;
        };

        const formatSizeInGiB = (sizeInBytes: number, round: VariableType<boolean>) => {
            const sizeInGiB = sizeInBytes / (1024 ** 3);
            return round.value ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
        };

        let usedRamGiB = formatSizeInGiB(usedRam, round);

        if (isNaN(usedRamGiB) || usedRamGiB < 0) {
            usedRamGiB = 0;
        }

        return {
            percentage: divide([totalRamInBytes, usedRam]),
            total: formatSizeInGiB(totalRamInBytes, round),
            used: usedRamGiB,
        };

    } catch (error) {
        console.error('Error calculating RAM usage:', error);
        return { total: 0, used: 0, percentage: 0 };
    }
};

