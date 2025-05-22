import { Module } from '../../shared/module';
import { getCPUTemperature } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';
import { UnitType } from 'src/lib/types/shared/unit.types';

const inputHandler = InputHandlerService.getDefault();

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

const cpuTemp = Variable(0);

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
                inputHandler.attachHandlers(self, {
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
