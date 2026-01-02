import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { CpuServiceCtor } from './types';

/**
 * Service for monitoring CPU usage percentage
 */
class CpuUsageService {
    private _updateFrequency: Variable<number>;
    private _previousCpuData = new GTop.glibtop_cpu();
    private _cpuPoller: FunctionPoller<number, []>;
    private _isInitialized = false;

    private _cpu = Variable(0);

    constructor({ frequency }: CpuServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        GTop.glibtop_get_cpu(this._previousCpuData);

        this._calculateUsage = this._calculateUsage.bind(this);

        this._cpuPoller = new FunctionPoller<number, []>(
            this.cpu,
            [bind(this._updateFrequency)],
            bind(this._updateFrequency),
            this._calculateUsage,
        );
    }

    /**
     * Manually refreshes the CPU usage reading
     */
    public refresh(): void {
        this._cpu.set(this._calculateUsage());
    }

    /**
     * Gets the CPU usage percentage variable
     *
     * @returns Variable containing CPU usage percentage (0-100)
     */
    public get cpu(): Variable<number> {
        return this._cpu;
    }

    /**
     * Calculates the current CPU usage percentage based on CPU time deltas
     *
     * @returns Current CPU usage percentage
     */
    private _calculateUsage(): number {
        const currentCpuData = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(currentCpuData);

        const totalDiff = currentCpuData.total - this._previousCpuData.total;
        const idleDiff = currentCpuData.idle - this._previousCpuData.idle;
        const iowaitDiff = currentCpuData.iowait - this._previousCpuData.iowait;

        const inactiveTime = idleDiff + iowaitDiff;
        const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - inactiveTime) / totalDiff) * 100 : 0;

        this._previousCpuData = currentCpuData;

        return cpuUsagePercentage;
    }

    /**
     * Updates the polling frequency for CPU usage monitoring
     *
     * @param timerInMs - New polling interval in milliseconds
     */
    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    /**
     * Initializes the CPU usage monitoring service
     */
    public initialize(): void {
        if (!this._isInitialized) {
            this._cpuPoller.initialize();
            this._isInitialized = true;
        }
    }

    /**
     * Stops the CPU usage polling
     */
    public stopPoller(): void {
        this._cpuPoller.stop();
    }

    /**
     * Starts the CPU usage polling
     */
    public startPoller(): void {
        this._cpuPoller.start();
    }

    /**
     * Cleans up resources and stops monitoring
     */
    public destroy(): void {
        this._cpuPoller.stop();
        this._cpu.drop();
        this._updateFrequency.drop();
    }
}

export default CpuUsageService;
