import options from 'options';
import { module } from '../module';

import { inputHandler } from 'customModules/utils';
import Button from 'types/widgets/button';
import { getWeatherStatusTextIcon, globalWeatherVar } from 'globals/weather';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';

const { label, unit, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.weather;

export const Weather = (): BarBoxChild => {
    const weatherModule = module({
        textIcon: Utils.merge([globalWeatherVar.bind('value')], (wthr) => {
            const weatherStatusIcon = getWeatherStatusTextIcon(wthr);
            return weatherStatusIcon;
        }),
        tooltipText: globalWeatherVar.bind('value').as((v) => `Weather Status: ${v.current.condition.text}`),
        boxClass: 'weather-custom',
        label: Utils.merge([globalWeatherVar.bind('value'), unit.bind('value')], (wthr, unt) => {
            if (unt === 'imperial') {
                return `${Math.ceil(wthr.current.temp_f)}° F`;
            } else {
                return `${Math.ceil(wthr.current.temp_c)}° C`;
            }
        }),
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

    return weatherModule;
};
