// TODO: Convert to a real service

const GLib = imports.gi.GLib;

import { pollVariable } from 'customModules/PollVar';
import { GenericResourceData } from 'lib/types/customModules/generic';

class Ram {
    private updateFrequency = Variable(2000);
    private shouldRound = false;

    public ram = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        pollVariable(this.ram, [], this.updateFrequency.bind('value'), this.calculateUsage);
    }

    public calculateUsage(): GenericResourceData {
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
                percentage: this.divide([totalRamInBytes, usedRam]),
                total: totalRamInBytes,
                used: usedRam,
                free: availableRamInBytes,
            };
        } catch (error) {
            console.error('Error calculating RAM usage:', error);
            return { total: 0, used: 0, percentage: 0, free: 0 };
        }
    }

    public setShouldRound(round: boolean): void {
        this.shouldRound = round;
    }

    private divide([total, used]: number[]): number {
        const percentageTotal = (used / total) * 100;

        if (this.shouldRound) {
            return total > 0 ? Math.round(percentageTotal) : 0;
        }

        return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
    }

    updateTimer(timerInMs: number): void {
        this.updateFrequency.value = timerInMs;
    }
}

export default Ram;
