import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { CpuServiceCtor } from './types';

class CpuUsageService {
    private _updateFrequency: Variable<number>;
    private _previousCpuData = new GTop.glibtop_cpu();
    private _cpuPoller: FunctionPoller<number, []>;

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

        this._cpuPoller.initialize();
    }

    public refresh(): void {
        this._cpu.set(this._calculateUsage());
    }

    public get cpu(): Variable<number> {
        return this._cpu;
    }

    private _calculateUsage(): number {
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

    public destroy(): void {
        this._cpuPoller.stop();
        this._cpu.drop();
        this._updateFrequency.drop();
    }
}

export default CpuUsageService;
