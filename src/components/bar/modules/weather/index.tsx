import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import WeatherService from 'src/services/weather';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';
import { toTitleCase } from 'src/lib/string/formatters';

const inputHandler = InputHandlerService.getInstance();

const weatherService = WeatherService.getInstance();

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(weatherService.statusIcon)], (icon) => {
        return icon;
    });

    const labelBinding = Variable.derive([bind(weatherService.temperature), bind(unit)], (temp) => {
        return temp;
    });

    let inputHandlerBindings: Variable<void>;

    const weatherModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(weatherService.weatherData).as(
            (wthr) => `Weather Status: ${toTitleCase(wthr.current.condition.text)}`,
        ),
        boxClass: 'weather-custom',
        label: labelBinding(),
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
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return weatherModule;
};
