import options from 'src/options';
import { Module } from '../../shared/Module';
import { calculateRamUsage } from './helpers';
import { formatTooltip, inputHandler, renderResourceLabel } from 'src/components/bar/utils/helpers';
import { LABEL_TYPES } from 'src/lib/types/defaults/bar';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from 'src/lib/types/customModules/generic';
import { bind, Variable } from 'astal';
import { BarBoxChild, ResourceLabelType } from 'src/lib/types/bar';
import { Astal } from 'astal/gtk3';

const { label, labelType, round, leftClick, rightClick, middleClick, pollingInterval, icon } =
    options.bar.customModules.ram;

const defaultRamData: GenericResourceData = { total: 0, used: 0, percentage: 0, free: 0 };
const ramUsage = Variable<GenericResourceData>(defaultRamData);

const ramPoller = new FunctionPoller<GenericResourceData, [Variable<boolean>]>(
    ramUsage,
    [bind(round)],
    bind(pollingInterval),
    calculateRamUsage,
    round,
);

ramPoller.initialize('ram');

export const Ram = (): BarBoxChild => {
    const labelBinding = Variable.derive(
        [bind(ramUsage), bind(labelType), bind(round)],
        (rmUsg: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
            const returnValue = renderResourceLabel(lblTyp, rmUsg, round);

            return returnValue;
        },
    );

    const ramModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
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
                                    (LABEL_TYPES.indexOf(labelType.get()) - 1 + LABEL_TYPES.length) % LABEL_TYPES.length
                                ] as ResourceLabelType,
                            );
                        },
                    },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
            },
        },
    });

    return ramModule;
};
