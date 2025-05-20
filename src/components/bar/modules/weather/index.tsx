import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/lib/types/bar.types';
import WeatherService from 'src/services/weather';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';

const inputHandler = InputHandlerService.getDefault();

const weatherService = WeatherService.get_default();

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(weatherService.weatherData)], (wthr) => {
        const weatherStatusIcon = weatherService.getWeatherStatusTextIcon(wthr);
        return weatherStatusIcon;
    });

    const labelBinding = Variable.derive([bind(weatherService.weatherData), bind(unit)], (wthr, unt) => {
        if (unt === 'imperial') {
            return `${Math.ceil(wthr.current.temp_f)}° F`;
        } else {
            return `${Math.ceil(wthr.current.temp_c)}° C`;
        }
    });

    const weatherModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(weatherService.weatherData).as(
            (v) => `Weather Status: ${v.current.condition.text}`,
        ),
        boxClass: 'weather-custom',
        label: labelBinding(),
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
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return weatherModule;
};
