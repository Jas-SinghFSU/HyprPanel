// TODO: Convert to a real service

import { bind, exec, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GPUStat } from 'src/lib/types/gpustat.types';

class Gpu {
    private _updateFrequency = Variable(2000);
    private _gpuPoller: FunctionPoller<number, []>;

    public gpuUsage = Variable<number>(0);

    constructor() {
        this.calculateUsage = this.calculateUsage.bind(this);

        this._gpuPoller = new FunctionPoller<number, []>(
            this.gpuUsage,
            [],
            bind(this._updateFrequency),
            this.calculateUsage,
        );

        this._gpuPoller.initialize();
    }

    public calculateUsage(): number {
        try {
            const gpuStats = exec('gpustat --json');
            if (typeof gpuStats !== 'string') {
                return 0;
            }

            const data = JSON.parse(gpuStats);

            const totalGpu = 100;
            const usedGpu =
                data.gpus.reduce((acc: number, gpu: GPUStat) => {
                    return acc + gpu['utilization.gpu'];
                }, 0) / data.gpus.length;

            return this._divide([totalGpu, usedGpu]);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting GPU stats:', error.message);
            } else {
                console.error('Unknown error getting GPU stats');
            }
            return 0;
        }
    }

    private _divide([total, free]: number[]): number {
        return free / total;
    }

    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this._gpuPoller.stop();
    }

    public startPoller(): void {
        this._gpuPoller.start();
    }
}

export default Gpu;
