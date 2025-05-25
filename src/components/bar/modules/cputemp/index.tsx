import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import CpuTempService from 'src/services/system/cputemp';
import options from 'src/configuration';
import { TemperatureConverter } from 'src/lib/units/temperature';

const inputHandler = InputHandlerService.getInstance();

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

const cpuTempService = new CpuTempService({ frequency: pollingInterval, sensor });

export const CpuTemp = (): BarBoxChild => {
    cpuTempService.initialize();

    const bindings = Variable.derive([bind(sensor), bind(round), bind(unit)], (sensorName) => {
        cpuTempService.refresh();

        if (cpuTempService.sensor.get() !== sensorName) {
            cpuTempService.updateSensor(sensorName);
        }
    });

    const labelBinding = Variable.derive(
        [bind(cpuTempService.temperature), bind(unit), bind(showUnit), bind(round)],
        (cpuTemp, tempUnit, showUnit, roundValue) => {
            const converter = TemperatureConverter.fromCelsius(cpuTemp);
            const isImperial = tempUnit === 'imperial';

            if (showUnit) {
                return isImperial
                    ? converter.formatFahrenheit(roundValue ? 0 : 2)
                    : converter.formatCelsius(roundValue ? 0 : 2);
            }

            const temp = isImperial
                ? converter.toFahrenheit(roundValue ? 0 : 2)
                : converter.toCelsius(roundValue ? 0 : 2);

            return temp.toString();
        },
    );

    let inputHandlerBindings: Variable<void>;

    const cpuTempModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU Temperature',
        boxClass: 'cpu-temp',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
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
                inputHandlerBindings.drop();
                cpuTempService.destroy();
                labelBinding.drop();
                bindings.drop();
            },
        },
    });

    return cpuTempModule;
};
