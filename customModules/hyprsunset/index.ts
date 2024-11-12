import options from 'options';
import { module } from '../module';

import { inputHandler, throttleInput } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { pollVariable } from 'customModules/PollVar';
import { checkSunsetStatus, isActive, toggleSunset } from './helpers';

const { label, pollingInterval, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hyprsunset;

const dummyVar = Variable(undefined);

checkSunsetStatus();

pollVariable(dummyVar, [], pollingInterval.bind('value'), checkSunsetStatus);

const throttledToggleSunset = throttleInput(() => toggleSunset(isActive), 1000);

export const Hyprsunset = (): BarBoxChild => {
    const hyprsunsetModule = module({
        textIcon: Utils.merge(
            [isActive.bind('value'), onIcon.bind('value'), offIcon.bind('value')],
            (active, onIcn, offIcn) => {
                return active ? onIcn : offIcn;
            },
        ),
        tooltipText: isActive.bind('value').as((active) => `Hyprsunset ${active ? 'enabled' : 'disabled'}`),
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
