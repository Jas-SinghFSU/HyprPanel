import options from 'options';

// Module initializer
import { module } from '../../utils/module';

// Types
import { GenericResourceData } from 'src/lib/types/customModules/generic';
import Button from 'types/widgets/button';

// Helper Methods
import { calculateRamUsage } from './computeRam';

// Utility Methods
import { formatTooltip, inputHandler, renderResourceLabel } from 'src/components/bar/utils/helpers';
import { BarBoxChild, ResourceLabelType } from 'src/lib/types/bar';

// Global Constants
import { LABEL_TYPES } from 'src/lib/types/defaults/bar';
import { Attribute, Child } from 'src/lib/types/widget';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { Variable as TVariable } from 'types/variable';

// All the user configurable options for the ram module that are needed
const { label, labelType, round, leftClick, rightClick, middleClick, pollingInterval, icon } =
    options.bar.customModules.ram;

const defaultRamData: GenericResourceData = { total: 0, used: 0, percentage: 0, free: 0 };
const ramUsage = Variable<GenericResourceData>(defaultRamData);

const ramPoller = new FunctionPoller<GenericResourceData, [TVariable<boolean>]>(
    ramUsage,
    [round.bind('value')],
    pollingInterval.bind('value'),
    calculateRamUsage,
    round,
);

ramPoller.initialize('ram');

export const Ram = (): BarBoxChild => {
    const ramModule = module({
        textIcon: icon.bind('value'),
        label: Utils.merge(
            [ramUsage.bind('value'), labelType.bind('value'), round.bind('value')],
            (rmUsg: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
                const returnValue = renderResourceLabel(lblTyp, rmUsg, round);

                return returnValue;
            },
        ),
        tooltipText: labelType.bind('value').as((lblTyp) => {
            return formatTooltip('RAM', lblTyp);
        }),
        boxClass: 'ram',
        showLabelBinding: label.bind('value'),
        props: {
            setup: (self: Button<Child, Attribute>) => {
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
                            labelType.value = LABEL_TYPES[
                                (LABEL_TYPES.indexOf(labelType.value) + 1) % LABEL_TYPES.length
                            ] as ResourceLabelType;
                        },
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.value = LABEL_TYPES[
                                (LABEL_TYPES.indexOf(labelType.value) - 1 + LABEL_TYPES.length) % LABEL_TYPES.length
                            ] as ResourceLabelType;
                        },
                    },
                });
            },
        },
    });

    return ramModule;
};
