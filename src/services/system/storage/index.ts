import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';

import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from '../types';
import { StorageServiceCtor } from './types';

class StorageService {
    private _updateFrequency: Variable<number>;
    private _shouldRound = false;
    private _storagePoller: FunctionPoller<GenericResourceData, []>;

    private _storage = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor({ frequency }: StorageServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        this._calculateUsage = this._calculateUsage.bind(this);
        this._storagePoller = new FunctionPoller<GenericResourceData, []>(
            this._storage,
            [],
            bind(this._updateFrequency),
            this._calculateUsage,
        );

        this._storagePoller.initialize();
    }

    public refresh(): void {
        this._storage.set(this._calculateUsage());
    }

    public get storage(): Variable<GenericResourceData> {
        return this._storage;
    }

    private _calculateUsage(): GenericResourceData {
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

    public destroy(): void {
        this._storagePoller.stop();
        this._storage.drop();
        this._updateFrequency.drop();
    }
}

export default StorageService;
