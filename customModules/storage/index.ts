import options from 'options';
import { module } from '../module';
import { formatTooltip, inputHandler, renderResourceLabel } from 'customModules/utils';
import { computeStorage } from './computeStorage';
import { BarBoxChild, ResourceLabelType } from 'common/lib/types/bar';
import { GenericResourceData } from 'common/lib/types/customModules/generic';
import Button from 'types/widgets/button';
import { LABEL_TYPES } from 'common/lib/types/defaults/bar';
import { Attribute, Child } from 'common/lib/types/widget';
import { Poller } from 'customModules/Poller';
import { Variable as TVariable } from 'types/variable';

const { label, labelType, icon, round, leftClick, rightClick, middleClick, pollingInterval } =
    options.bar.customModules.storage;

const defaultStorageData = { total: 0, used: 0, percentage: 0, free: 0 };

const storageUsage = Variable<GenericResourceData>(defaultStorageData);

const storagePoller = new Poller<GenericResourceData, [TVariable<boolean>]>(
    storageUsage,
    [round.bind('value')],
    pollingInterval.bind('value'),
    computeStorage,
    round,
);

storagePoller.start();

export const Storage = (): BarBoxChild => {
    const storageModule = module({
        textIcon: icon.bind('value'),
        label: Utils.merge(
            [storageUsage.bind('value'), labelType.bind('value'), round.bind('value')],
            (storage: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
                return renderResourceLabel(lblTyp, storage, round);
            },
        ),
        tooltipText: labelType.bind('value').as((lblTyp) => {
            return formatTooltip('Storage', lblTyp);
        }),
        boxClass: 'storage',
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

    return storageModule;
};
