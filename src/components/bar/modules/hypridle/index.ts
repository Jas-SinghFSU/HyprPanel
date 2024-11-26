import options from '../../../../options';
import { module } from '../../utils/module';

import { inputHandler, throttleInput } from '../../utils/helpers';
import { checkIdleStatus, isActive, toggleIdle } from './helpers';
import { FunctionPoller } from '../../../../lib/poller/FunctionPoller';
import Variable from 'astal/variable';
import { GtkWidget } from '../../../../lib/types/widget';

const { label, pollingInterval, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hypridle;

const dummyVar = Variable(undefined);

checkIdleStatus();

const idleStatusPoller = new FunctionPoller<undefined, []>(dummyVar, [], pollingInterval.bind(), checkIdleStatus);

idleStatusPoller.initialize('hypridle');

const throttledToggleIdle = throttleInput(() => toggleIdle(isActive), 1000);

export const Hypridle = (): GtkWidget => {
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
