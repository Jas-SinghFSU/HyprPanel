import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { getCPUTemperature } from './helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { UnitType } from 'src/lib/types/weather';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

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

const cpuTempPoller = new FunctionPoller<number, [Variable<boolean>, Variable<UnitType>]>(
    cpuTemp,
    [bind(sensor), bind(round), bind(unit)],
    bind(pollingInterval),
    getCPUTemperature,
    round,
    unit,
);

cpuTempPoller.initialize('cputemp');

export const CpuTemp = (): BarBoxChild => {
    const labelBinding = Variable.derive(
        [bind(cpuTemp), bind(unit), bind(showUnit), bind(round)],
        (cpuTmp, tempUnit, shwUnit) => {
            const unitLabel = tempUnit === 'imperial' ? 'F' : 'C';
            const unit = shwUnit ? ` ${unitLabel}` : '';
            return `${cpuTmp.toString()}°${unit}`;
        },
    );
    const cpuTempModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU Temperature',
        boxClass: 'cpu-temp',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
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
            onDestroy: () => {
                labelBinding.drop();
            },
        },
    });

    return cpuTempModule;
};
