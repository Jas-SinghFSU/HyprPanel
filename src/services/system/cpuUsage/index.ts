import { bind, GLib, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { CpuServiceCtor } from './types';

interface CoreStat {
    total: number;
    idle: number;
}

/**
 * Service for monitoring CPU usage percentage
 */
class CpuUsageService {
    private _updateFrequency: Variable<number>;
    private _previousCpuData = new GTop.glibtop_cpu();
    private _cpuPoller: FunctionPoller<number, []>;
    private _isInitialized = false;
    private _previousPerCoreData: CoreStat[] = [];

    private _cpu = Variable(0);
    private _perCoreUsage = Variable<number[]>([]);

    constructor({ frequency }: CpuServiceCtor = {}) {
        this._updateFrequency = frequency ?? Variable(2000);
        GTop.glibtop_get_cpu(this._previousCpuData);

        this._initializePerCoreData();

        this._calculateUsage = this._calculateUsage.bind(this);

        this._cpuPoller = new FunctionPoller<number, []>(
            this.cpu,
            [bind(this._updateFrequency)],
            bind(this._updateFrequency),
            this._calculateUsage,
        );
    }

    /**
     * Initializes per-core CPU data from /proc/stat
     */
    private _initializePerCoreData(): void {
        try {
            const [success, statBytes] = GLib.file_get_contents('/proc/stat');
            if (!success || !statBytes) return;

            const statContent = new TextDecoder('utf-8').decode(statBytes);
            const lines = statContent.split('\n');

            this._previousPerCoreData = [];

            for (const line of lines) {
                if (/^cpu\d+/.test(line)) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 5) {
                        const user = parseInt(parts[1], 10) || 0;
                        const nice = parseInt(parts[2], 10) || 0;
                        const system = parseInt(parts[3], 10) || 0;
                        const idle = parseInt(parts[4], 10) || 0;
                        const iowait = parseInt(parts[5] || '0', 10) || 0;

                        const total = user + nice + system + idle + iowait;
                        this._previousPerCoreData.push({ total, idle });
                    } else {
                        this._previousPerCoreData.push({ total: 0, idle: 0 });
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing per-core CPU data:', error);
        }
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
     * Gets the per-core CPU usage percentages
     *
     * @returns Variable containing array of CPU usage percentages for each core
     */
    public get perCoreUsage(): Variable<number[]> {
        return this._perCoreUsage;
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

        this._calculatePerCoreUsage();
        
        this._previousCpuData = currentCpuData;

        return cpuUsagePercentage;
    }

    /**
     * Calculates per-core CPU usage from /proc/stat
     */
    private _calculatePerCoreUsage(): void {
        try {
            const [success, statBytes] = GLib.file_get_contents('/proc/stat');
            if (!success || !statBytes) return;

            const statContent = new TextDecoder('utf-8').decode(statBytes);
            const lines = statContent.split('\n');
            const perCoreUsages: number[] = [];
            let coreIndex = 0;

            for (const line of lines) {
                if (/^cpu\d+/.test(line)) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 5 && coreIndex < this._previousPerCoreData.length) {
                        const user = parseInt(parts[1], 10) || 0;
                        const nice = parseInt(parts[2], 10) || 0;
                        const system = parseInt(parts[3], 10) || 0;
                        const idle = parseInt(parts[4], 10) || 0;
                        const iowait = parseInt(parts[5] || '0', 10) || 0;

                        const currentTotal = user + nice + system + idle + iowait;
                        const currentIdle = idle;

                        const prevData = this._previousPerCoreData[coreIndex];
                        const totalDiff = currentTotal - prevData.total;
                        const idleDiff = currentIdle - prevData.idle;

                        const coreUsage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;
                        perCoreUsages.push(parseFloat(coreUsage.toFixed(2)));

                        this._previousPerCoreData[coreIndex] = { total: currentTotal, idle: currentIdle };
                    } else {
                        perCoreUsages.push(0);
                    }
                    coreIndex++;
                }
            }

            if (perCoreUsages.length > 0) {
                this._perCoreUsage.set(perCoreUsages);
            }
        } catch (error) {
            console.error('Error calculating per-core CPU usage:', error);
        }
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
        this._perCoreUsage.drop();
        this._updateFrequency.drop();
    }
}

export default CpuUsageService;
