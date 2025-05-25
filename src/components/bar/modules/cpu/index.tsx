import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { InputHandlerService } from '../../utils/input/inputHandler';
import CpuUsageService from 'src/services/system/cpuUsage';

const inputHandler = InputHandlerService.getInstance();

const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval, icon } =
    options.bar.customModules.cpu;

const cpuService = new CpuUsageService({ frequency: pollingInterval });

export const Cpu = (): BarBoxChild => {
    cpuService.initialize();

    const labelBinding = Variable.derive(
        [bind(cpuService.cpu), bind(round)],
        (cpuUsg: number, round: boolean) => {
            return round ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
        },
    );

    let inputHandlerBindings: Variable<void>;

    const cpuModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
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
            onDestroy: () => {
                inputHandlerBindings.drop();
                labelBinding.drop();
                cpuService.destroy();
            },
        },
    });

    return cpuModule;
};
