import options from 'options';
import { module } from '../module';

import { inputHandler, throttleInput } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { checkSunsetStatus, isActive, toggleSunset } from './helpers';
import { FunctionPoller } from 'lib/poller/FunctionPoller';

const {
    label,
    pollingInterval,
    onIcon,
    offIcon,
    onLabel,
    offLabel,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    temperature,
} = options.bar.customModules.hyprsunset;

const dummyVar = Variable(undefined);

checkSunsetStatus();

const sunsetPoller = new FunctionPoller<undefined, []>(dummyVar, [], pollingInterval.bind('value'), checkSunsetStatus);

sunsetPoller.initialize('hyprsunset');

const throttledToggleSunset = throttleInput(() => toggleSunset(isActive), 1000);

export const Hyprsunset = (): BarBoxChild => {
    const hyprsunsetModule = module({
        textIcon: Utils.merge(
            [isActive.bind('value'), onIcon.bind('value'), offIcon.bind('value')],
            (active, onIcn, offIcn) => {
                return active ? onIcn : offIcn;
            },
        ),
        tooltipText: Utils.merge([isActive.bind('value'), temperature.bind('value')], (active, temp) => {
            return `Hyprsunset ${active ? 'enabled' : 'disabled'}\nTemperature: ${temp}`;
        }),
        boxClass: 'hyprsunset',
        label: Utils.merge(
            [isActive.bind('value'), onLabel.bind('value'), offLabel.bind('value')],
            (active, onLbl, offLbl) => {
                return active ? onLbl : offLbl;
            },
        ),
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        fn: () => {
                            throttledToggleSunset();
                        },
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

    return hyprsunsetModule;
};
