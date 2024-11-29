import options from 'src/options';
import { module } from '../../utils/module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { getWeatherStatusTextIcon, globalWeatherVar } from 'src/globals/weather';
import { BarBoxChild } from 'src/lib/types/bar';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const weatherModule = module({
        textIcon: Variable.derive([bind(globalWeatherVar)], (wthr) => {
            const weatherStatusIcon = getWeatherStatusTextIcon(wthr);
            return weatherStatusIcon;
        })(),
        tooltipText: bind(globalWeatherVar).as((v) => `Weather Status: ${v.current.condition.text}`),
        boxClass: 'weather-custom',
        label: Variable.derive([bind(globalWeatherVar), bind(unit)], (wthr, unt) => {
            if (unt === 'imperial') {
                return `${Math.ceil(wthr.current.temp_f)}° F`;
            } else {
                return `${Math.ceil(wthr.current.temp_c)}° C`;
            }
        })(),
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
        },
    });

    return weatherModule;
};
