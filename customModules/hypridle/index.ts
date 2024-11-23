import options from 'options';
import { module } from '../module';

import { inputHandler, throttleInput } from 'customModules/utils';
import Button from 'types/widgets/button';
import { Attribute, Child } from 'lib/types/widget';
import { BarBoxChild } from 'lib/types/bar';
import { checkIdleStatus, isActive, toggleIdle } from './helpers';
import { FunctionPoller } from 'lib/poller/FunctionPoller';

const { label, pollingInterval, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hypridle;

const dummyVar = Variable(undefined);

checkIdleStatus();

const idleStatusPoller = new FunctionPoller<undefined, []>(
    dummyVar,
    [],
    pollingInterval.bind('value'),
    checkIdleStatus,
);

idleStatusPoller.initialize('hypridle');

const throttledToggleIdle = throttleInput(() => toggleIdle(isActive), 1000);

export const Hypridle = (): BarBoxChild => {
    const hypridleModule = module({
        textIcon: Utils.merge(
            [isActive.bind('value'), onIcon.bind('value'), offIcon.bind('value')],
            (active, onIcn, offIcn) => {
                return active ? onIcn : offIcn;
            },
        ),
        tooltipText: isActive.bind('value').as((active) => `Hypridle ${active ? 'enabled' : 'disabled'}`),
        boxClass: 'hypridle',
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
                            throttledToggleIdle();
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

    return hypridleModule;
};
