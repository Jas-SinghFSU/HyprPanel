import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/lib/types/bar.types';
import WeatherManager from 'src/services/weather';

const weatherManager = WeatherManager.get_default();

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(weatherManager.weatherData)], (wthr) => {
        const weatherStatusIcon = weatherManager.getWeatherStatusTextIcon(wthr);
        return weatherStatusIcon;
    });

    const labelBinding = Variable.derive([bind(weatherManager.weatherData), bind(unit)], (wthr, unt) => {
        if (unt === 'imperial') {
            return `${Math.ceil(wthr.current.temp_f)}° F`;
        } else {
            return `${Math.ceil(wthr.current.temp_c)}° C`;
        }
    });

    const weatherModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(weatherManager.weatherData).as(
            (v) => `Weather Status: ${v.current.condition.text}`,
        ),
        boxClass: 'weather-custom',
        label: labelBinding(),
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
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return weatherModule;
};
