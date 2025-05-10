// TODO: Convert to a real service

import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';

import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from 'src/lib/types/customModules/generic.types';

class Storage {
    private _updateFrequency = Variable(2000);
    private _shouldRound = false;
    private _storagePoller: FunctionPoller<GenericResourceData, []>;

    public storage = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        this._storagePoller = new FunctionPoller<GenericResourceData, []>(
            this.storage,
            [],
            bind(this._updateFrequency),
            this.calculateUsage,
        );

        this._storagePoller.initialize();
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
                percentage: this._divide([total, used]),
            };
        } catch (error) {
            console.error('Error calculating Storage usage:', error);
            return { total: 0, used: 0, percentage: 0, free: 0 };
        }
    }

    public setShouldRound(round: boolean): void {
        this._shouldRound = round;
    }

    private _divide([total, used]: number[]): number {
        const percentageTotal = (used / total) * 100;

        if (this._shouldRound) {
            return total > 0 ? Math.round(percentageTotal) : 0;
        }

        return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
    }

    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this._storagePoller.stop();
    }

    public startPoller(): void {
        this._storagePoller.start();
    }
}

export default Storage;
