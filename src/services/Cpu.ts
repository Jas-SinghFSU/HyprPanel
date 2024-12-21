// TODO: Convert to a real service

import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';

class Cpu {
    private updateFrequency = Variable(2000);
    private previousCpuData = new GTop.glibtop_cpu();
    private cpuPoller: FunctionPoller<number, []>;

    public cpu = Variable(0);

    constructor() {
        GTop.glibtop_get_cpu(this.previousCpuData);

        this.calculateUsage = this.calculateUsage.bind(this);

        this.cpuPoller = new FunctionPoller<number, []>(this.cpu, [], bind(this.updateFrequency), this.calculateUsage);

        this.cpuPoller.initialize();
    }

    public calculateUsage(): number {
        const currentCpuData = new GTop.glibtop_cpu();
        GTop.glibtop_get_cpu(currentCpuData);

        // Calculate the differences from the previous to current data
        const totalDiff = currentCpuData.total - this.previousCpuData.total;
        const idleDiff = currentCpuData.idle - this.previousCpuData.idle;

        const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;

        this.previousCpuData = currentCpuData;

        return cpuUsagePercentage;
    }

    public updateTimer(timerInMs: number): void {
        this.updateFrequency.set(timerInMs);
    }

    public stopPoller(): void {
        this.cpuPoller.stop();
    }

    public startPoller(): void {
        this.cpuPoller.start();
    }
}

export default Cpu;
