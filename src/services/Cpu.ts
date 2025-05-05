// TODO: Convert to a real service

import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';

class Cpu {
    private _updateFrequency = Variable(2000);
    private _previousCpuData = new GTop.glibtop_cpu();
    private _cpuPoller: FunctionPoller<number, []>;

    public cpu = Variable(0);

    constructor() {
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

    public calculateUsage(): number {
        const currentCpuData = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(currentCpuData);

        // Calculate the differences from the previous to current data
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

export default Cpu;
