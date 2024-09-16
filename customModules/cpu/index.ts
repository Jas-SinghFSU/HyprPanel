import options from 'options';

// Module initializer
import { module } from '../module';

// import { CpuData } from "lib/types/customModules/cpu";
import Button from 'types/widgets/button';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';

// Utility Methods
import { inputHandler } from 'customModules/utils';
import { computeCPU } from './computeCPU';
import { pollVariable } from 'customModules/PollVar';
import { Module } from 'lib/types/bar';

// All the user configurable options for the cpu module that are needed
const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval } =
    options.bar.customModules.cpu;

export const cpuUsage = Variable(0);

pollVariable(
    // Variable to poll and update with the result of the function passed in
    cpuUsage,
    // Variables that should trigger the polling function to update when they change
    [round.bind('value')],
    // Interval at which to poll
    pollingInterval.bind('value'),
    // Function to execute to get the network data
    computeCPU,
);

export const Cpu = (): Module => {
    const renderLabel = (cpuUsg: number, rnd: boolean): string => {
        return rnd ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    };

    const cpuModule = module({
        textIcon: '',
        label: Utils.merge([cpuUsage.bind('value'), round.bind('value')], (cpuUsg, rnd) => {
            return renderLabel(cpuUsg, rnd);
        }),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: label.bind('value'),
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
        },
    });

    return cpuModule;
};
