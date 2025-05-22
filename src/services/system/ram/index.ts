import { bind, GLib, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from '../types';

class RamService {
    private static _instance: RamService;
    private _updateFrequency = Variable(2000);
    private _shouldRound = false;
    private _ramPoller: FunctionPoller<GenericResourceData, []>;

    public ram = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });

    private constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);
        this._ramPoller = new FunctionPoller<GenericResourceData, []>(
            this.ram,
            [],
            bind(this._updateFrequency),
            this.calculateUsage,
        );

        this._ramPoller.initialize();
    }

    public static getDefault(): RamService {
        if (this._instance === undefined) {
            this._instance = new RamService();
        }

        return this._instance;
    }

    public calculateUsage(): GenericResourceData {
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
        this._ramPoller.stop();
    }

    public startPoller(): void {
        this._ramPoller.start();
    }
}

export default RamService;
