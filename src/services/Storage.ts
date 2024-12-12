// TODO: Convert to a real service

import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';

import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from 'src/lib/types/customModules/generic';

class Storage {
    private updateFrequency = Variable(2000);
    private shouldRound = false;
    private storagePoller: FunctionPoller<GenericResourceData, []>;

    public storage = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        this.storagePoller = new FunctionPoller<GenericResourceData, []>(
            this.storage,
            [],
            bind(this.updateFrequency),
            this.calculateUsage,
        );

        this.storagePoller.initialize();
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
        this.updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this.storagePoller.stop();
    }

    public startPoller(): void {
        this.storagePoller.start();
    }
}

export default Storage;
