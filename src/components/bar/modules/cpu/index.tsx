import { Module } from '../../shared/module';
import { computeCPU } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { InputHandlerService } from '../../utils/input/inputHandler';

const inputHandler = InputHandlerService.getDefault();

const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval, icon } =
    options.bar.customModules.cpu;

const cpuUsage = Variable(0);

const cpuPoller = new FunctionPoller<number, []>(cpuUsage, [bind(round)], bind(pollingInterval), computeCPU);

cpuPoller.initialize('cpu');

export const Cpu = (): BarBoxChild => {
    const labelBinding = Variable.derive([bind(cpuUsage), bind(round)], (cpuUsg: number, round: boolean) => {
        return round ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    });

    const cpuModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler.attachHandlers(self, {
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
                labelBinding.drop();
            },
        },
    });

    return cpuModule;
};
