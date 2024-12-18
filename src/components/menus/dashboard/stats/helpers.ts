import { execAsync } from 'astal';
import { App } from 'astal/gtk3';
import options from 'src/options';
import Cpu from 'src/services/Cpu';
import Gpu from 'src/services/Gpu';
import Ram from 'src/services/Ram';
import Storage from 'src/services/Storage';

const { terminal } = options;
const { interval, enabled, enable_gpu } = options.menus.dashboard.stats;

export const handleClick = (): void => {
    App.get_window('dashboardmenu')?.set_visible(false);
    execAsync(`bash -c "${terminal} -e btop"`).catch((err) => `Failed to open btop: ${err}`);
};

const monitorInterval = (cpuService: Cpu, ramService: Ram, storageService: Storage): void => {
    interval.subscribe(() => {
        ramService.updateTimer(interval.get());
        cpuService.updateTimer(interval.get());
        storageService.updateTimer(interval.get());
    });
};

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

const monitorGpuTrackingEnabled = (gpuService: Gpu): void => {
    enable_gpu.subscribe((gpuEnabled) => {
        if (gpuEnabled) {
            return gpuService.startPoller();
        }

        gpuService.stopPoller();
    });
};

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
