import options from 'src/options';
import { Module } from '../../shared/Module';
import { calculateRamUsage } from './helpers';
import { formatTooltip, inputHandler, renderResourceLabel } from 'src/components/bar/utils/helpers';
import { LABEL_TYPES } from 'src/lib/types/defaults/bar.types';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild, ResourceLabelType } from 'src/lib/types/bar.types';
import { GenericResourceData } from 'src/lib/types/customModules/generic.types';

const { label, labelType, round, leftClick, rightClick, middleClick, pollingInterval, showGraph, historyLength, icon } =
    options.bar.customModules.ram;

const defaultRamData: GenericResourceData = { total: 0, used: 0, percentage: 0, free: 0 };
const ramUsage = Variable<GenericResourceData>(defaultRamData);
const ramHistory = Variable<number[]>([]);

const historyLengthBinding = Variable.derive([bind(historyLength)], (length: number) => length);

const ramPoller = new FunctionPoller<GenericResourceData, [Variable<boolean>]>(
    ramUsage,
    [bind(round)],
    bind(pollingInterval),
    calculateRamUsage,
    round,
);

ramPoller.initialize('ram');

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
    ? Variable.derive([bind(ramUsage), historyLengthBinding()], (rmUsg: GenericResourceData, hstLength: number) => {
          const history = ramHistory.get();
          history.push(rmUsg.percentage);
          if (history.length > hstLength) {
              history.shift();
          }
          ramHistory.set(history);

          return history.map(getBarGraph).join('');
      })
    : Variable.derive([], () => '');

export const Ram = (): BarBoxChild => {
    const labelBinding = Variable.derive(
        [bind(ramUsage), bind(labelType), bind(round)],
        (rmUsg: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
            const returnValue = renderResourceLabel(lblTyp, rmUsg, round);
            return returnValue;
        },
    );

    const combinedLabelBinding = Variable.derive([labelBinding(), graphBinding()], (label: string, graph: string) => {
        return showGraph ? `${label} ${graph}` : label;
    });

    const ramModule = Module({
        textIcon: bind(icon),
        label: combinedLabelBinding(),
        tooltipText: bind(labelType).as((lblTyp) => {
            return formatTooltip('RAM', lblTyp);
        }),
        boxClass: 'ram',
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
                        fn: () => {
                            labelType.set(
                                LABEL_TYPES[
                                    (LABEL_TYPES.indexOf(labelType.get()) + 1) % LABEL_TYPES.length
                                ] as ResourceLabelType,
                            );
                        },
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.set(
                                LABEL_TYPES[
                                    (LABEL_TYPES.indexOf(labelType.get()) - 1 + LABEL_TYPES.length) %
                                        LABEL_TYPES.length
                                ] as ResourceLabelType,
                            );
                        },
                    },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
                graphBinding.drop();
                combinedLabelBinding.drop();
            },
        },
    });

    return ramModule;
};
