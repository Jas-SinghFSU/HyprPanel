import GTop from 'gi://GTop';

let previousCpuData = new GTop.glibtop_cpu();
GTop.glibtop_get_cpu(previousCpuData);

/**
 * Computes the CPU usage percentage.
 *
 * This function calculates the CPU usage percentage by comparing the current CPU data with the previous CPU data.
 * It calculates the differences in total and idle CPU times and uses these differences to compute the usage percentage.
 *
 * @returns The CPU usage percentage as a number.
 */
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
