import { module } from '../module';

import options from 'options';
import Button from 'types/widgets/button';

// Utility Methods
import { inputHandler } from 'customModules/utils';
import { computeCPU } from './computeCPU';
import { BarBoxChild } from 'lib/types/bar';
import { Attribute, Child } from 'lib/types/widget';
import { FunctionPoller } from 'lib/poller/FunctionPoller';

// All the user configurable options for the cpu module that are needed
const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval, icon } =
    options.bar.customModules.cpu;

export const cpuUsage = Variable(0);

// Instantiate the Poller class for CPU usage polling
const cpuPoller = new FunctionPoller<number, []>(
    // Variable to poll and update with the result of the function passed in
    cpuUsage,
    // Variables that should trigger the polling function to update when they change
    [round.bind('value')],
    // Interval at which to poll
    pollingInterval.bind('value'),
    // Function to execute to get the network data
    computeCPU,
);

cpuPoller.initialize('cpu');

export const Cpu = (): BarBoxChild => {
    const renderLabel = (cpuUsg: number, rnd: boolean): string => {
        return rnd ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    };

    const cpuModule = module({
        textIcon: icon.bind('value'),
        label: Utils.merge([cpuUsage.bind('value'), round.bind('value')], (cpuUsg, rnd) => {
            return renderLabel(cpuUsg, rnd);
        }),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
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
