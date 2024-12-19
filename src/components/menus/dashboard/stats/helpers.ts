import { execAsync } from 'astal';
import { App } from 'astal/gtk3';
import options from 'src/options';
import Cpu from 'src/services/Cpu';
import Gpu from 'src/services/Gpu';
import Ram from 'src/services/Ram';
import Storage from 'src/services/Storage';

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
const monitorInterval = (cpuService: Cpu, ramService: Ram, storageService: Storage): void => {
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
const monitorStatsEnabled = (cpuService: Cpu, ramService: Ram, gpuService: Gpu, storageService: Storage): void => {
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
const monitorGpuTrackingEnabled = (gpuService: Gpu): void => {
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
export const initializePollers = (cpuService: Cpu, ramService: Ram, gpuService: Gpu, storageService: Storage): void => {
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
