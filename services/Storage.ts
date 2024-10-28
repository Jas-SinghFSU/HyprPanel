// TODO: Convert to a real service

// @ts-expect-error: This import is a special directive that tells the compiler to use the GTop library
import GTop from 'gi://GTop';

import { pollVariable } from 'customModules/PollVar';
import { GenericResourceData } from 'lib/types/customModules/generic';

class Storage {
    private updateFrequency = Variable(2000);
    private shouldRound = false;

    public storage = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        pollVariable(this.storage, [], this.updateFrequency.bind('value'), this.calculateUsage);
    }

    public calculateUsage(): GenericResourceData {
        try {
            const currentFsUsage = new GTop.glibtop_fsusage();

            GTop.glibtop_get_fsusage(currentFsUsage, '/');

            const total = currentFsUsage.blocks * currentFsUsage.block_size;
            const available = currentFsUsage.bavail * currentFsUsage.block_size;
            const used = total - available;

            return {
                total,
                used,
                free: available,
                percentage: this.divide([total, used]),
            };
        } catch (error) {
            console.error('Error calculating Storage usage:', error);
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

    public updateTimer(timerInMs: number): void {
        this.updateFrequency.value = timerInMs;
    }
}

export default Storage;
