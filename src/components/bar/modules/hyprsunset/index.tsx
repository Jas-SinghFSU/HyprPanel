import { Module } from '../../shared/module';
import { checkSunsetStatus, isActive, toggleSunset } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';
import { throttleInput } from '../../utils/input/throttle';

const inputHandler = InputHandlerService.getInstance();

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

const sunsetPoller = new FunctionPoller<undefined, []>(
    dummyVar,
    [],
    bind(pollingInterval),
    checkSunsetStatus,
);

sunsetPoller.initialize('hyprsunset');

const throttledToggleSunset = throttleInput(() => toggleSunset(isActive), 1000);

export const Hyprsunset = (): BarBoxChild => {
    const iconBinding = Variable.derive(
        [bind(isActive), bind(onIcon), bind(offIcon)],
        (active, onIcn, offIcn) => {
            return active ? onIcn : offIcn;
        },
    );

    const tooltipBinding = Variable.derive([isActive, temperature], (active, temp) => {
        return `Hyprsunset ${active ? 'enabled' : 'disabled'}\nTemperature: ${temp}`;
    });

    const labelBinding = Variable.derive(
        [bind(isActive), bind(onLabel), bind(offLabel)],
        (active, onLbl, offLbl) => {
            return active ? onLbl : offLbl;
        },
    );

    let inputHandlerBindings: Variable<void>;

    const hyprsunsetModule = Module({
        textIcon: iconBinding(),
        tooltipText: tooltipBinding(),
        boxClass: 'hyprsunset',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
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
                inputHandlerBindings.drop();
                iconBinding.drop();
                tooltipBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return hyprsunsetModule;
};
