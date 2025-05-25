import { bind, exec, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GpuServiceCtor, GPUStat } from './types';

class GpuUsageService {
    private _updateFrequency: Variable<number>;
    private _gpuPoller: FunctionPoller<number, []>;
    private _isInitialized = false;

    public _gpu = Variable<number>(0);

    constructor({ frequency }: GpuServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        this._calculateUsage = this._calculateUsage.bind(this);

        this._gpuPoller = new FunctionPoller<number, []>(
            this._gpu,
            [],
            bind(this._updateFrequency),
            this._calculateUsage,
        );
    }

    public refresh(): void {
        this._gpu.set(this._calculateUsage());
    }

    public get gpu(): Variable<number> {
        return this._gpu;
    }

    private _calculateUsage(): number {
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

    /**
     * Initializes the GPU usage monitoring poller
     */
    public initialize(): void {
        if (!this._isInitialized) {
            this._gpuPoller.initialize();
            this._isInitialized = true;
        }
    }

    public stopPoller(): void {
        this._gpuPoller.stop();
    }

    public startPoller(): void {
        this._gpuPoller.start();
    }

    public destroy(): void {
        this._gpuPoller.stop();
        this._gpu.drop();
        this._updateFrequency.drop();
    }
}

export default GpuUsageService;
