const GLib = imports.gi.GLib;

import { divide } from 'customModules/utils';
import { GenericResourceData } from 'lib/types/customModules/generic';
import { Variable as VariableType } from 'types/variable';

// FIX: Consolidate with Ram service class
export const calculateRamUsage = (round: VariableType<boolean>): GenericResourceData => {
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

        let usedRam = totalRamInBytes - availableRamInBytes;
        usedRam = isNaN(usedRam) || usedRam < 0 ? 0 : usedRam;

        return {
            percentage: divide([totalRamInBytes, usedRam], round.value),
            total: totalRamInBytes,
            used: usedRam,
            free: availableRamInBytes,
        };
    } catch (error) {
        console.error('Error calculating RAM usage:', error);
        return { total: 0, used: 0, percentage: 0, free: 0 };
    }
};
