import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';

class CpuService {
    private static _instance: CpuService;
    private _updateFrequency = Variable(2000);
    private _previousCpuData = new GTop.glibtop_cpu();
    private _cpuPoller: FunctionPoller<number, []>;

    public cpu = Variable(0);

    private constructor() {
        GTop.glibtop_get_cpu(this._previousCpuData);

        this.calculateUsage = this.calculateUsage.bind(this);

        this._cpuPoller = new FunctionPoller<number, []>(
            this.cpu,
            [],
            bind(this._updateFrequency),
            this.calculateUsage,
        );

        this._cpuPoller.initialize();
    }

    public static getInstance(): CpuService {
        if (this._instance === undefined) {
            this._instance = new CpuService();
        }

        return this._instance;
    }

    public calculateUsage(): number {
        const currentCpuData = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(currentCpuData);

        const totalDiff = currentCpuData.total - this._previousCpuData.total;
        const idleDiff = currentCpuData.idle - this._previousCpuData.idle;

        const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;

        this._previousCpuData = currentCpuData;

        return cpuUsagePercentage;
    }

    public updateTimer(timerInMs: number): void {
        this._updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this._cpuPoller.stop();
    }

    public startPoller(): void {
        this._cpuPoller.start();
    }
}

export default CpuService;
