import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import WeatherService from 'src/services/weather';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';

const inputHandler = InputHandlerService.getInstance();

const weatherService = WeatherService.getInstance();

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(weatherService.weatherData)], (wthr) => {
        const weatherStatusIcon = wthr.current.condition.text;
        return weatherStatusIcon;
    });

    const labelBinding = Variable.derive([bind(weatherService.weatherData), bind(unit)], (wthr, unt) => {
        if (unt === 'imperial') {
            // FIX: Convert to F
            return `${Math.ceil(wthr.current.temperature)}° F`;
        } else {
            return `${Math.ceil(wthr.current.temperature)}° C`;
        }
    });

    let inputHandlerBindings: Variable<void>;

    const weatherModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(weatherService.weatherData).as(
            (wthr) => `Weather Status: ${wthr.current.condition.text}`,
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
