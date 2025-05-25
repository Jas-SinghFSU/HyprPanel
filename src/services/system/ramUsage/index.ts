import { bind, GLib, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from '../types';
import { RamServiceCtor } from './types';

class RamUsageService {
    private _updateFrequency: Variable<number>;
    private _ramPoller: FunctionPoller<GenericResourceData, []>;
    private _isInitialized = false;

    private _ram = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    constructor({ frequency }: RamServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        this._calculateUsage = this._calculateUsage.bind(this);

        this._ramPoller = new FunctionPoller<GenericResourceData, []>(
            this._ram,
            [bind(this._updateFrequency)],
            bind(this._updateFrequency),
            this._calculateUsage,
        );
    }

    public refresh(): void {
        this._ram.set(this._calculateUsage());
    }

    public get ram(): Variable<GenericResourceData> {
        return this._ram;
    }

    private _calculateUsage(): GenericResourceData {
        try {
            const [success, meminfoBytes] = GLib.file_get_contents('/proc/meminfo');

            if (!success || meminfoBytes === undefined) {
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
                percentage: this._divide([totalRamInBytes, usedRam]),
                total: totalRamInBytes,
                used: usedRam,
                free: availableRamInBytes,
            };
        } catch (error) {
            console.error('Error calculating RAM usage:', error);
            return { total: 0, used: 0, percentage: 0, free: 0 };
        }
    }

    private _divide([total, used]: number[]): number {
        const percentageTotal = (used / total) * 100;

        return total > 0 ? parseFloat(percentageTotal.toFixed(2)) : 0;
    }

    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    public initialize(): void {
        if (!this._isInitialized) {
            this._ramPoller.initialize();
            this._isInitialized = true;
        }
    }

    public stopPoller(): void {
        this._ramPoller.stop();
    }

    public startPoller(): void {
        this._ramPoller.start();
    }

    public destroy(): void {
        this._ramPoller.stop();
        this._ram.drop();
        this._updateFrequency.drop();
    }
}

export default RamUsageService;
