import { Module } from '../../shared/Module';
import options from 'src/options';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { computeCPU } from './helpers';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/lib/types/bar.types';

const {
    label,
    round,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    pollingInterval,
    showGraph,
    historyLength,
    icon,
} = options.bar.customModules.cpu;

export const cpuUsage = Variable(0);
const cpuHistory = Variable<number[]>([]);

const historyLengthBinding = Variable.derive([bind(historyLength)], (length: number) => length);

const cpuPoller = new FunctionPoller<number, []>(cpuUsage, [bind(round)], bind(pollingInterval), computeCPU);

cpuPoller.initialize('cpu');

const getBarGraph = (usage: number): string => {
    if (usage < 12.5) return '▁';
    if (usage < 25) return '▂';
    if (usage < 37.5) return '▃';
    if (usage < 50) return '▄';
    if (usage < 62.5) return '▅';
    if (usage < 75) return '▆';
    if (usage < 87.5) return '▇';
    return '█';
};

const graphBinding = showGraph
    ? Variable.derive([bind(cpuUsage), historyLengthBinding()], (cpuUsg: number, hstLength: number) => {
          const history = cpuHistory.get();
          history.push(cpuUsg);
          if (history.length > hstLength) {
              history.shift();
          }
          cpuHistory.set(history);

          return history.map(getBarGraph).join('');
      })
    : Variable.derive([], () => '');

export const Cpu = (): BarBoxChild => {
    const percentageBinding = Variable.derive([bind(cpuUsage), bind(round)], (cpuUsg: number, round: boolean) => {
        return round ? `${Math.round(cpuUsg)}%` : `${cpuUsg.toFixed(2)}%`;
    });

    const labelBinding = Variable.derive([percentageBinding(), graphBinding()], (percentage: string, graph: string) => {
        return showGraph ? `${percentage} ${graph}` : percentage;
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
                percentageBinding.drop();
                graphBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return cpuModule;
};
