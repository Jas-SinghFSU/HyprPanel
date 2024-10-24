// TODO: Convert to a real service

// @ts-expect-error: This import is a special directive that tells the compiler to use the GTop library
import GTop from 'gi://GTop';

import { pollVariable } from 'customModules/PollVar';

class Cpu {
    private updateFrequency = Variable(2000);
    public cpu = Variable(0);

    private previousCpuData = new GTop.glibtop_cpu();

    constructor() {
        GTop.glibtop_get_cpu(this.previousCpuData);

        this.calculateUsage = this.calculateUsage.bind(this);
        pollVariable(this.cpu, [], this.updateFrequency.bind('value'), this.calculateUsage);
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
        this.updateFrequency.value = timerInMs;
    }
}

export default Cpu;
