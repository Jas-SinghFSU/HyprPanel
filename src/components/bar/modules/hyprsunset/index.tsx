import options from 'src/options';
import { module } from '../../shared/module';
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
    const hyprsunsetModule = module({
        textIcon: Variable.derive([bind(isActive), bind(onIcon), bind(offIcon)], (active, onIcn, offIcn) => {
            return active ? onIcn : offIcn;
        })(),
        tooltipText: Variable.derive([isActive, temperature], (active, temp) => {
            return `Hyprsunset ${active ? 'enabled' : 'disabled'}\nTemperature: ${temp}`;
        })(),
        boxClass: 'hyprsunset',
        label: Variable.derive([bind(isActive), bind(onLabel), bind(offLabel)], (active, onLbl, offLbl) => {
            return active ? onLbl : offLbl;
        })(),
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
        },
    });

    return hyprsunsetModule;
};
