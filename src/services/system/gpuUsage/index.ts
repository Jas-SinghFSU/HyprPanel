import { bind, exec, Variable } from 'astal';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GpuServiceCtor, GPUStat, AMDGpuStat, GpuVendor } from './types';

/**
 * Service for monitoring GPU usage percentage using gpustat (NVIDIA) or amdgpu_top (AMD)
 */
class GpuUsageService {
    private _updateFrequency: Variable<number>;
    private _gpuPoller: FunctionPoller<number, []>;
    private _isInitialized = false;
    private _gpuVendor: GpuVendor = 'unknown';

    public _gpu = Variable<number>(0);

    constructor({ frequency }: GpuServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        this._calculateUsage = this._calculateUsage.bind(this);
        this._detectGpuVendor();

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
     * Detects the GPU vendor (NVIDIA or AMD) by checking available commands
     */
    /**
     * Detects the GPU vendor by checking available commands.
     * Easily extendable for new vendors/tools.
     */
    private _detectGpuVendor(): void {
        const vendorDetectionMap: Record<string, { cmd: string; }> = {
            nvidia: {
                cmd: 'gpustat --json'
            },
            amd: {
                cmd: 'amdgpu_top --json --dump'
            },
            // Add more vendors/tools here as needed
            // Maybe someone can add here the part for intel GPUs
        };

        for (const [vendor, { cmd }] of Object.entries(vendorDetectionMap)) {
            try {
                const result = exec(cmd);
                if (result && typeof result === 'string') {
                    this._gpuVendor = vendor as GpuVendor;
                    return;
                }
            } catch (error) {
                continue;
            }
        }
        console.warn('No supported GPU monitoring tool found');
        this._gpuVendor = 'unknown';
    }

    /**
     * Calculates average GPU usage across all available GPUs
     *
     * @returns GPU usage as a decimal between 0 and 1
     */
    private _calculateUsage(): number {
        if (this._gpuVendor === 'nvidia') {
            return this._calculateNvidiaUsage();
        } else if (this._gpuVendor === 'amd') {
            return this._calculateAmdUsage();
        }
        return 0;
    }

    /**
     * Calculates average NVIDIA GPU usage using gpustat
     *
     * @returns GPU usage as a decimal between 0 and 1
     */
    private _calculateNvidiaUsage(): number {
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
                console.error('Error getting NVIDIA GPU stats:', error.message);
            } else {
                console.error('Unknown error getting NVIDIA GPU stats');
            }
            return 0;
        }
    }

    /**
     * Calculates average AMD GPU usage using amdgpu_top
     *
     * @returns GPU usage as a decimal between 0 and 1
     */
    private _calculateAmdUsage(): number {
        try {
            const gpuStats = exec('amdgpu_top --json --dump');
            if (typeof gpuStats !== 'string') {
                return 0;
            }

            const data: AMDGpuStat[] = JSON.parse(gpuStats);

            if (!data || data.length === 0) {
                return 0;
            }

            const totalGpu = 100;
            let totalUsage = 0;
            let deviceCount = 0;

            for (const device of data) {
                if (device.gpu_activity && device.gpu_activity.GFX) {
                    totalUsage += device.gpu_activity.GFX.value;
                    deviceCount++;
                }
            }

            const averageUsage = deviceCount > 0 ? totalUsage / deviceCount : 0;
            return this._divide([totalGpu, averageUsage]);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error getting AMD GPU stats:', error.message);
            } else {
                console.error('Unknown error getting AMD GPU stats');
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
