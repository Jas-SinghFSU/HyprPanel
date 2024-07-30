import options from "options";
import { GPU_Stat } from "lib/types/gpustat";
import { dependencies } from "lib/utils";

const { terminal } = options;
const { enable_gpu } = options.menus.dashboard.stats;

const Stats = () => {
    const divide = ([total, free]) => free / total;

    const formatSizeInGB = (sizeInKB: number) =>
        Number((sizeInKB / 1024 ** 2).toFixed(2));

    const cpu = Variable(0, {
        poll: [
            2000,
            "top -b -n 1",
            (out) => {
                if (typeof out !== "string") {
                    return 0;
                }

                const cpuOut = out.split("\n").find((line) => line.includes("Cpu(s)"));

                if (cpuOut === undefined) {
                    return 0;
                }

                return divide([100, cpuOut.split(/\s+/)[1].replace(",", ".")]);
            },
        ],
    });

    const ram = Variable(
        { total: 0, used: 0, percentage: 0 },
        {
            poll: [
                2000,
                "free",
                (out) => {
                    if (typeof out !== "string") {
                        return { total: 0, used: 0, percentage: 0 };
                    }

                    const ramOut = out.split("\n").find((line) => line.includes("Mem:"));

                    if (ramOut === undefined) {
                        return { total: 0, used: 0, percentage: 0 };
                    }

                    const [totalRam, usedRam] = ramOut
                        .split(/\s+/)
                        .splice(1, 2)
                        .map(Number);

                    return {
                        percentage: divide([totalRam, usedRam]),
                        total: formatSizeInGB(totalRam),
                        used: formatSizeInGB(usedRam),
                    };
                },
            ],
        },
    );

    const gpu = Variable(0);

    const GPUStat = Widget.Box({
        child: enable_gpu.bind("value").as((gpStat) => {
            if (!gpStat || !dependencies("gpustat")) {
                return Widget.Box();
            }

            return Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: "stat gpu",
                        hexpand: true,
                        vpack: "center",
                        setup: self => {
                            const getGpuUsage = () => {
                                if (!enable_gpu.value) {
                                    gpu.value = 0;
                                    return;
                                }

                                Utils.execAsync("gpustat --json")
                                    .then((out) => {
                                        if (typeof out !== "string") {
                                            return 0;
                                        }
                                        try {
                                            const data = JSON.parse(out);

                                            const totalGpu = 100;
                                            const usedGpu =
                                                data.gpus.reduce((acc: number, gpu: GPU_Stat) => {

                                                    return acc + gpu["utilization.gpu"]
                                                }, 0) / data.gpus.length;

                                            gpu.value = divide([totalGpu, usedGpu]);
                                        } catch (e) {
                                            console.error("Error getting GPU stats:", e);
                                            gpu.value = 0;
                                        }
                                    })
                                    .catch((err) => {
                                        console.error(`An error occurred while fetching GPU stats: ${err}`)
                                    })
                            }

                            self.poll(2000, getGpuUsage)

                            Utils.merge([gpu.bind("value"), enable_gpu.bind("value")], (gpu, enableGpu) => {
                                if (!enableGpu) {
                                    return self.children = [];
                                }

                                return self.children = [
                                    Widget.Button({
                                        on_primary_click: terminal.bind("value").as(term => {
                                            return () => {
                                                App.closeWindow("dashboardmenu");
                                                Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                                    (err) => `Failed to open btop: ${err}`,
                                                );
                                            }
                                        }),
                                        label: "󰢮",
                                    }),
                                    Widget.Button({
                                        on_primary_click: terminal.bind("value").as(term => {
                                            return () => {
                                                App.closeWindow("dashboardmenu");
                                                Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                                    (err) => `Failed to open btop: ${err}`,
                                                );
                                            }
                                        }),
                                        child: Widget.LevelBar({
                                            class_name: "stats-bar",
                                            hexpand: true,
                                            vpack: "center",
                                            value: gpu,
                                        }),
                                    }),
                                ]
                            })
                        },
                    }),
                    Widget.Box({
                        hpack: "end",
                        children: Utils.merge([gpu.bind("value"), enable_gpu.bind("value")], (gpuUsed, enableGpu) => {
                            if (!enableGpu) {
                                return [];
                            }
                            return [
                                Widget.Label({
                                    class_name: "stat-value gpu",
                                    label: `${Math.floor(gpuUsed * 100)}%`,
                                })
                            ];
                        })
                    })
                ]
            })
        })
    });

    const storage = Variable(
        { total: 0, used: 0, percentage: 0 },
        {
            poll: [
                2000,
                "df -B1 /",
                (out) => {
                    if (typeof out !== "string") {
                        return { total: 0, used: 0, percentage: 0 };
                    }

                    const dfOut = out.split("\n").find((line) => line.startsWith("/"));

                    if (dfOut === undefined) {
                        return { total: 0, used: 0, percentage: 0 };
                    }

                    const parts = dfOut.split(/\s+/);
                    const size = parseInt(parts[1], 10);
                    const used = parseInt(parts[2], 10);

                    const sizeInGB = formatSizeInGB(size);
                    const usedInGB = formatSizeInGB(used);

                    return {
                        total: Math.floor(sizeInGB / 1000),
                        used: Math.floor(usedInGB / 1000),
                        percentage: divide([size, used]),
                    };
                },
            ],
        },
    );

    return Widget.Box({
        class_name: "dashboard-card stats-container",
        vertical: true,
        vpack: "fill",
        hpack: "fill",
        expand: true,
        children: [
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: "stat cpu",
                        hexpand: true,
                        vpack: "center",
                        children: [
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                label: "",
                            }),
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                child: Widget.LevelBar({
                                    class_name: "stats-bar",
                                    hexpand: true,
                                    vpack: "center",
                                    bar_mode: "continuous",
                                    max_value: 1,
                                    value: cpu.bind("value"),
                                }),
                            }),
                        ],
                    }),
                    Widget.Label({
                        hpack: "end",
                        class_name: "stat-value cpu",
                        label: cpu.bind("value").as((v) => `${Math.floor(v * 100)}%`),
                    }),
                ],
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: "stat ram",
                        vpack: "center",
                        hexpand: true,
                        children: [
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                label: "",
                            }),
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                child: Widget.LevelBar({
                                    class_name: "stats-bar",
                                    hexpand: true,
                                    vpack: "center",
                                    value: ram.bind("value").as((v) => v.percentage),
                                }),
                            }),
                        ],
                    }),
                    Widget.Label({
                        hpack: "end",
                        class_name: "stat-value ram",
                        label: ram.bind("value").as((v) => `${v.used}/${v.total} GB`),
                    }),
                ],
            }),
            GPUStat,
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: "stat storage",
                        hexpand: true,
                        vpack: "center",
                        children: [
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                label: "󰋊",
                            }),
                            Widget.Button({
                                on_primary_click: terminal.bind("value").as(term => {
                                    return () => {
                                        App.closeWindow("dashboardmenu");
                                        Utils.execAsync(`bash -c "${term} -e btop"`).catch(
                                            (err) => `Failed to open btop: ${err}`,
                                        );
                                    }
                                }),
                                child: Widget.LevelBar({
                                    class_name: "stats-bar",
                                    hexpand: true,
                                    vpack: "center",
                                    value: storage.bind("value").as((v) => v.percentage),
                                }),
                            })
                        ],
                    }),
                    Widget.Label({
                        hpack: "end",
                        class_name: "stat-value storage",
                        label: storage.bind("value").as((v) => `${v.used}/${v.total} GB`),
                    }),
                ],
            }),
        ],
    });
};

export { Stats };
