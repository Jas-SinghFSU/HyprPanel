// @ts-expect-error
import GTop from 'gi://GTop';

let previousCpuData = new GTop.glibtop_cpu();
GTop.glibtop_get_cpu(previousCpuData);

export const computeCPU = () => {
    const currentCpuData = new GTop.glibtop_cpu();
    GTop.glibtop_get_cpu(currentCpuData);

    // Calculate the differences from the previous to current data
    const totalDiff = currentCpuData.total - previousCpuData.total;
    const idleDiff = currentCpuData.idle - previousCpuData.idle;

    const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;

    previousCpuData = currentCpuData;

    return cpuUsagePercentage;
}

