import options from 'options';
import Ram from 'services/Ram';
import { GPU_Stat } from 'lib/types/gpustat';
import { dependencies } from 'lib/utils';
import { BoxWidget } from 'lib/types/widget';
import Cpu from 'services/Cpu';
import Storage from 'services/Storage';
import { renderResourceLabel } from 'customModules/utils';

const { terminal } = options;
const { enable_gpu, interval } = options.menus.dashboard.stats;

const ramService = new Ram();
const cpuService = new Cpu();
const storageService = new Storage();

ramService.setShouldRound(true);
storageService.setShouldRound(true);

interval.connect('changed', () => {
    ramService.updateTimer(interval.value);
    cpuService.updateTimer(interval.value);
    storageService.updateTimer(interval.value);
});

const handleClick = (): void => {
    App.closeWindow('dashboardmenu');
    Utils.execAsync(`bash -c "${terminal} -e btop"`).catch((err) => `Failed to open btop: ${err}`);
};

const Stats = (): BoxWidget => {
    const divide = ([total, free]: number[]): number => free / total;

    const gpu = Variable(0);

    const GPUStat = Widget.Box({
        child: enable_gpu.bind('value').as((gpStat) => {
            if (!gpStat || !dependencies('gpustat')) {
                return Widget.Box();
            }

            return Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'stat gpu',
                        hexpand: true,
                        vpack: 'center',
                        setup: (self) => {
                            const getGpuUsage = (): void => {
                                if (!enable_gpu.value) {
                                    gpu.value = 0;
                                    return;
                                }

                                Utils.execAsync('gpustat --json')
                                    .then((out) => {
                                        if (typeof out !== 'string') {
                                            return 0;
                                        }
                                        try {
                                            const data = JSON.parse(out);

                                            const totalGpu = 100;
                                            const usedGpu =
                                                data.gpus.reduce((acc: number, gpu: GPU_Stat) => {
                                                    return acc + gpu['utilization.gpu'];
                                                }, 0) / data.gpus.length;

                                            gpu.value = divide([totalGpu, usedGpu]);
                                        } catch (e) {
                                            console.error('Error getting GPU stats:', e);
                                            gpu.value = 0;
                                        }
                                    })
                                    .catch((err) => {
                                        console.error(`An error occurred while fetching GPU stats: ${err}`);
                                    });
                            };

                            self.poll(2000, getGpuUsage);

                            Utils.merge([gpu.bind('value'), enable_gpu.bind('value')], (gpu, enableGpu) => {
                                if (!enableGpu) {
                                    return (self.children = []);
                                }

                                return (self.children = [
                                    Widget.Button({
                                        on_primary_click: () => {
                                            handleClick();
                                        },
                                        child: Widget.Label({
                                            class_name: 'txt-icon',
                                            label: '󰢮',
                                        }),
                                    }),
                                    Widget.Button({
                                        on_primary_click: () => {
                                            handleClick();
                                        },
                                        child: Widget.LevelBar({
                                            class_name: 'stats-bar',
                                            hexpand: true,
                                            vpack: 'center',
                                            value: gpu,
                                        }),
                                    }),
                                ]);
                            });
                        },
                    }),
                    Widget.Box({
                        hpack: 'end',
                        children: Utils.merge([gpu.bind('value'), enable_gpu.bind('value')], (gpuUsed, enableGpu) => {
                            if (!enableGpu) {
                                return [];
                            }
                            return [
                                Widget.Label({
                                    class_name: 'stat-value gpu',
                                    label: `${Math.floor(gpuUsed * 100)}%`,
                                }),
                            ];
                        }),
                    }),
                ],
            });
        }),
    });

    return Widget.Box({
        class_name: 'dashboard-card stats-container',
        vertical: true,
        vpack: 'fill',
        hpack: 'fill',
        expand: true,
        children: [
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'stat cpu',
                        hexpand: true,
                        vpack: 'center',
                        children: [
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.Label({
                                    class_name: 'txt-icon',
                                    label: '',
                                }),
                            }),
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.LevelBar({
                                    class_name: 'stats-bar',
                                    hexpand: true,
                                    vpack: 'center',
                                    bar_mode: 'continuous',
                                    max_value: 1,
                                    value: cpuService.cpu.bind('value').as((cpuUsage) => Math.round(cpuUsage) / 100),
                                }),
                            }),
                        ],
                    }),
                    Widget.Label({
                        hpack: 'end',
                        class_name: 'stat-value cpu',
                        label: cpuService.cpu.bind('value').as((cpuUsage) => `${Math.round(cpuUsage)}%`),
                    }),
                ],
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'stat ram',
                        vpack: 'center',
                        hexpand: true,
                        children: [
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.Label({
                                    class_name: 'txt-icon',
                                    label: '',
                                }),
                            }),
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.LevelBar({
                                    class_name: 'stats-bar',
                                    hexpand: true,
                                    vpack: 'center',
                                    value: ramService.ram.bind('value').as((ramUsage) => {
                                        return ramUsage.percentage / 100;
                                    }),
                                }),
                            }),
                        ],
                    }),
                    Widget.Label({
                        hpack: 'end',
                        class_name: 'stat-value ram',
                        label: ramService.ram
                            .bind('value')
                            .as((ramUsage) => `${renderResourceLabel('used/total', ramUsage, true)}`),
                    }),
                ],
            }),
            GPUStat,
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'stat storage',
                        hexpand: true,
                        vpack: 'center',
                        children: [
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.Label({
                                    class_name: 'txt-icon',
                                    label: '󰋊',
                                }),
                            }),
                            Widget.Button({
                                on_primary_click: () => {
                                    handleClick();
                                },
                                child: Widget.LevelBar({
                                    class_name: 'stats-bar',
                                    hexpand: true,
                                    vpack: 'center',
                                    value: storageService.storage
                                        .bind('value')
                                        .as((storageUsage) => storageUsage.percentage / 100),
                                }),
                            }),
                        ],
                    }),
                    Widget.Label({
                        hpack: 'end',
                        class_name: 'stat-value storage',
                        label: storageService.storage
                            .bind('value')
                            .as((storageUsage) => `${renderResourceLabel('used/total', storageUsage, true)}`),
                    }),
                ],
            }),
        ],
    });
};

export { Stats };
