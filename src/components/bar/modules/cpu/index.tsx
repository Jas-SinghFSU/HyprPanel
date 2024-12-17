import { Module } from '../../shared/Module';
import options from 'src/options';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { computeCPU } from './helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

const { label, round, leftClick, rightClick, middleClick, scrollUp, scrollDown, pollingInterval, icon } =
    options.bar.customModules.cpu;

export const cpuUsage = Variable(0);

const cpuPoller = new FunctionPoller<number, []>(cpuUsage, [bind(round)], bind(pollingInterval), computeCPU);

cpuPoller.initialize('cpu');

export const Cpu = (): BarBoxChild => {
    const renderLabel = (cpuUsg: number, rnd: boolean): string => {
        return rnd ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    };

    const labelBinding = Variable.derive([bind(cpuUsage), bind(round)], (cpuUsg, rnd) => {
        return renderLabel(cpuUsg, rnd);
    });

    const cpuModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: 'CPU',
        boxClass: 'cpu',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
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
