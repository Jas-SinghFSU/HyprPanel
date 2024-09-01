import options from "options";

// @ts-expect-error
import GTop from 'gi://GTop';

// Module initializer
import { module } from "../../modules/bar/module"

// import { CpuData } from "lib/types/customModules/cpu";
import Button from "types/widgets/button";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

// Utility Methods
import { inputHandler } from "customModules/utils";

// All the user configurable options for the cpu module that are needed
const {
    label,
    round,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    pollingInterval
} = options.bar.customModules.cpu;

export const Cpu = () => {
    const defaultCpuData: number = 0;

    let previousCpuData = new GTop.glibtop_cpu();
    GTop.glibtop_get_cpu(previousCpuData);

    const cpuUsage = Variable(
        defaultCpuData,
        {
            poll: [
                pollingInterval.value,
                () => {
                    const currentCpuData = new GTop.glibtop_cpu();
                    GTop.glibtop_get_cpu(currentCpuData);

                    // Calculate the differences from the previous to current data
                    const totalDiff = currentCpuData.total - previousCpuData.total;
                    const idleDiff = currentCpuData.idle - previousCpuData.idle;

                    const cpuUsagePercentage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0;

                    previousCpuData = currentCpuData;

                    return cpuUsagePercentage
                },
            ],
        },
    );

    const renderLabel = (cpuUsg: number, rnd: boolean) => {
        return rnd ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    }

    const cpuModule = module({
        textIcon: "",
        label: Utils.merge(
            [cpuUsage.bind("value"), round.bind("value")],
            (cpuUsg, rnd) => {
                return renderLabel(cpuUsg, rnd);
            }),
        tooltipText: "CPU",
        boxClass: "cpu",
        showLabel: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
        }
    });

    return cpuModule;
}

