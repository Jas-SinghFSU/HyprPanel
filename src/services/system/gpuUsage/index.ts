import { bind, exec, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GpuServiceCtor, GPUStat } from './types';

/**
 * Service for monitoring GPU usage percentage using gpustat
 */
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

    /**
     * Manually refreshes the GPU usage reading
     */
    public refresh(): void {
        this._gpu.set(this._calculateUsage());
    }

    /**
     * Gets the GPU usage percentage variable
     *
     * @returns Variable containing GPU usage percentage (0-1)
     */
    public get gpu(): Variable<number> {
        return this._gpu;
    }

    /**
     * Calculates average GPU usage across all available GPUs
     *
     * @returns GPU usage as a decimal between 0 and 1
     */
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

    /**
     * Converts usage percentage to decimal
     *
     * @param values - Tuple of [total, used] values
     * @returns Usage as decimal between 0 and 1
     */
    private _divide([total, free]: number[]): number {
        return free / total;
    }

    /**
     * Updates the polling frequency
     *
     * @param timerInMs - New polling interval in milliseconds
     */
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

    /**
     * Stops the GPU usage polling
     */
    public stopPoller(): void {
        this._gpuPoller.stop();
    }

    /**
     * Starts the GPU usage polling
     */
    public startPoller(): void {
        this._gpuPoller.start();
    }

    /**
     * Cleans up resources and stops monitoring
     */
    public destroy(): void {
        this._gpuPoller.stop();
        this._gpu.drop();
        this._updateFrequency.drop();
    }
}

export default GpuUsageService;
