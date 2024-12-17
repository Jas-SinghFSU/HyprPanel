import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler, throttleInput } from '../../utils/helpers';
import { checkIdleStatus, isActive, toggleIdle } from './helpers';
import { FunctionPoller } from '../../../../lib/poller/FunctionPoller';
import Variable from 'astal/variable';
import { bind } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { Astal } from 'astal/gtk3';

const { label, pollingInterval, onIcon, offIcon, onLabel, offLabel, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.hypridle;

const dummyVar = Variable(undefined);

checkIdleStatus();

const idleStatusPoller = new FunctionPoller<undefined, []>(dummyVar, [], bind(pollingInterval), checkIdleStatus);

idleStatusPoller.initialize('hypridle');

const throttledToggleIdle = throttleInput(() => toggleIdle(isActive), 1000);

export const Hypridle = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(isActive), bind(onIcon), bind(offIcon)], (active, onIcn, offIcn) => {
        return active ? onIcn : offIcn;
    });
    const labelBinding = Variable.derive([bind(isActive), bind(onLabel), bind(offLabel)], (active, onLbl, offLbl) => {
        return active ? onLbl : offLbl;
    });

    const hypridleModule = Module({
        textIcon: iconBinding(),
        tooltipText: bind(isActive).as((active) => `Hypridle ${active ? 'enabled' : 'disabled'}`),
        boxClass: 'hypridle',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
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
            onDestroy: () => {
                iconBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return hypridleModule;
};
