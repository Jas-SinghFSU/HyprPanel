import options from 'options';

// Module initializer
import { module } from '../module';

// Types
import { GenericResourceData } from 'lib/types/customModules/generic';
import Button from 'types/widgets/button';

// Helper Methods
import { calculateRamUsage } from './computeRam';

// Utility Methods
import { formatTooltip, inputHandler, renderResourceLabel } from 'customModules/utils';
import { BarBoxChild, ResourceLabelType } from 'lib/types/bar';

// Global Constants
import { LABEL_TYPES } from 'lib/types/defaults/bar';
import { pollVariable } from 'customModules/PollVar';
import { Attribute, Child } from 'lib/types/widget';

// All the user configurable options for the ram module that are needed
const { label, labelType, round, leftClick, rightClick, middleClick, pollingInterval, icon } =
    options.bar.customModules.ram;

const defaultRamData: GenericResourceData = { total: 0, used: 0, percentage: 0, free: 0 };
const ramUsage = Variable<GenericResourceData>(defaultRamData);

pollVariable(ramUsage, [round.bind('value')], pollingInterval.bind('value'), calculateRamUsage, round);

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
