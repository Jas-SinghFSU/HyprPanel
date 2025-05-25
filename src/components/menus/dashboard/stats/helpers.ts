import { execAsync } from 'astal';
import { App } from 'astal/gtk3';
import GpuUsageService from 'src/services/system/gpuUsage';
import CpuUsageService from 'src/services/system/cpuUsage';
import RamUsageService from 'src/services/system/ramUsage';
import StorageService from 'src/services/system/storage';
import options from 'src/configuration';

const { terminal } = options;
const { interval, enabled, enable_gpu } = options.menus.dashboard.stats;

/**
 * Handles the click event for the dashboard menu.
 *
 * This function hides the dashboard menu window and attempts to open the `btop` terminal application.
 * If the command fails, it logs an error message.
 */
export const handleClick = (): void => {
    App.get_window('dashboardmenu')?.set_visible(false);
    execAsync(`bash -c "${terminal} -e btop"`).catch((err) => `Failed to open btop: ${err}`);
};

/**
 * Monitors the interval for updating CPU, RAM, and storage services.
 *
 * This function subscribes to the interval setting and updates the timers for the CPU, RAM, and storage services accordingly.
 *
 * @param cpuService The CPU service instance.
 * @param ramService The RAM service instance.
 * @param storageService The storage service instance.
 */
const monitorInterval = (
    cpuService: CpuUsageService,
    ramService: RamUsageService,
    storageService: StorageService,
): void => {
    interval.subscribe(() => {
        ramService.updateTimer(interval.get());
        cpuService.updateTimer(interval.get());
        storageService.updateTimer(interval.get());
    });
};

/**
 * Monitors the enabled state for CPU, RAM, GPU, and storage services.
 *
 * This function subscribes to the enabled setting and starts or stops the pollers for the CPU, RAM, GPU, and storage services based on the enabled state.
 *
 * @param cpuService The CPU service instance.
 * @param ramService The RAM service instance.
 * @param gpuService The GPU service instance.
 * @param storageService The storage service instance.
 */
const monitorStatsEnabled = (
    cpuService: CpuUsageService,
    ramService: RamUsageService,
    gpuService: GpuUsageService,
    storageService: StorageService,
): void => {
    enabled.subscribe(() => {
        if (!enabled.get()) {
            ramService.stopPoller();
            cpuService.stopPoller();
            gpuService.stopPoller();
            storageService.stopPoller();
            return;
        }

        if (enable_gpu.get()) {
            gpuService.startPoller();
        }

        ramService.startPoller();
        cpuService.startPoller();
        storageService.startPoller();
    });
};

/**
 * Monitors the GPU tracking enabled state.
 *
 * This function subscribes to the GPU tracking enabled setting and starts or stops the GPU poller based on the enabled state.
 *
 * @param gpuService The GPU service instance.
 */
const monitorGpuTrackingEnabled = (gpuService: GpuUsageService): void => {
    enable_gpu.subscribe((gpuEnabled) => {
        if (gpuEnabled) {
            return gpuService.startPoller();
        }

        gpuService.stopPoller();
    });
};

/**
 * Initializes the pollers for CPU, RAM, GPU, and storage services.
 *
 * This function sets up the initial state for the CPU, RAM, GPU, and storage services, including starting the pollers if enabled.
 * It also sets up monitoring for interval changes, enabled state changes, and GPU tracking enabled state.
 *
 * @param cpuService The CPU service instance.
 * @param ramService The RAM service instance.
 * @param gpuService The GPU service instance.
 * @param storageService The storage service instance.
 */
export const initializePollers = (
    cpuService: CpuUsageService,
    ramService: RamUsageService,
    gpuService: GpuUsageService,
    storageService: StorageService,
): void => {
    ramService.setShouldRound(true);
    storageService.setShouldRound(true);

    if (enabled.get()) {
        ramService.startPoller();
        cpuService.startPoller();
        storageService.startPoller();
    }

    if (enabled.get() && enable_gpu.get()) {
        gpuService.startPoller();
    } else {
        gpuService.stopPoller();
    }

    monitorInterval(cpuService, ramService, storageService);
    monitorStatsEnabled(cpuService, ramService, gpuService, storageService);
    monitorGpuTrackingEnabled(gpuService);
};
