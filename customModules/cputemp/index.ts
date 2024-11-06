import options from 'options';

// Module initializer
import { module } from '../module';

import Button from 'types/widgets/button';

// Utility Methods
import { inputHandler } from 'customModules/utils';
import { getCPUTemperature } from './helpers';
import { pollVariable } from 'customModules/PollVar';
import { BarBoxChild } from 'lib/types/bar';
import { Attribute, Child } from 'lib/types/widget';

// All the user configurable options for the cpu module that are needed
const {
    label,
    sensor,
    round,
    showUnit,
    unit,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    pollingInterval,
    icon,
} = options.bar.customModules.cpuTemp;

export const cpuTemp = Variable(0);

pollVariable(
    // Variable to poll and update with the result of the function passed in
    cpuTemp,
    // Variables that should trigger the polling function to update when they change
    [sensor.bind('value'), round.bind('value'), unit.bind('value')],
    // Interval at which to poll
    pollingInterval.bind('value'),
    // Function to execute to get the network data
    getCPUTemperature,
    round,
    unit,
);

export const CpuTemp = (): BarBoxChild => {
    const cpuTempModule = module({
        textIcon: icon.bind('value'),
        label: Utils.merge(
            [cpuTemp.bind('value'), unit.bind('value'), showUnit.bind('value'), round.bind('value')],
            (cpuTmp, tempUnit, shwUnit) => {
                const unitLabel = tempUnit === 'imperial' ? 'F' : 'C';
                const unit = shwUnit ? ` ${unitLabel}` : '';

                return `${cpuTmp.toString()}°${unit}`;
            },
        ),
        tooltipText: 'CPU Temperature',
        boxClass: 'cpu-temp',
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

    return cpuTempModule;
};
