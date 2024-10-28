// @ts-expect-error: This import is a special directive that tells the compiler to use the GTop library
import GTop from 'gi://GTop';

let previousCpuData = new GTop.glibtop_cpu();
GTop.glibtop_get_cpu(previousCpuData);

// FIX: Consolidate with Cpu service class
export const computeCPU = (): number => {
    const currentCpuData = new GTop.glibtop_cpu();
    GTop.glibtop_get_cpu(currentCpuData);

    // Calculate the differences from the previous to current data
    const totalDiff = currentCpuData.total - previousCpuData.total;
    const idleDiff = currentCpuData.idle - previousCpuData.idle;

    const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;

    previousCpuData = currentCpuData;

    return cpuUsagePercentage;
};
