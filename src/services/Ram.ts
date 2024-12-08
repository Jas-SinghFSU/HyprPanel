// TODO: Convert to a real service

import { bind, GLib, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from 'src/lib/types/customModules/generic';

class Ram {
    private updateFrequency = Variable(2000);
    private shouldRound = false;
    private ramPoller: FunctionPoller<GenericResourceData, []>;

    public ram = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        this.ramPoller = new FunctionPoller<GenericResourceData, []>(
            this.ram,
            [],
            bind(this.updateFrequency),
            this.calculateUsage,
        );

        this.ramPoller.initialize('ram');
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
        this.updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this.ramPoller.stop();
    }

    public startPoller(): void {
        this.ramPoller.start();
    }
}

export default Ram;
