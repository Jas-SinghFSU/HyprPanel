import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler, throttleInput } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { checkSunsetStatus, isActive, toggleSunset } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

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

const sunsetPoller = new FunctionPoller<undefined, []>(dummyVar, [], bind(pollingInterval), checkSunsetStatus);

sunsetPoller.initialize('hyprsunset');

const throttledToggleSunset = throttleInput(() => toggleSunset(isActive), 1000);

export const Hyprsunset = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(isActive), bind(onIcon), bind(offIcon)], (active, onIcn, offIcn) => {
        return active ? onIcn : offIcn;
    });

    const tooltipBinding = Variable.derive([isActive, temperature], (active, temp) => {
        return `Hyprsunset ${active ? 'enabled' : 'disabled'}\nTemperature: ${temp}`;
    });

    const labelBinding = Variable.derive([bind(isActive), bind(onLabel), bind(offLabel)], (active, onLbl, offLbl) => {
        return active ? onLbl : offLbl;
    });

    const hyprsunsetModule = Module({
        textIcon: iconBinding(),
        tooltipText: tooltipBinding(),
        boxClass: 'hyprsunset',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
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
            onDestroy: () => {
                iconBinding.drop();
                tooltipBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return hyprsunsetModule;
};
