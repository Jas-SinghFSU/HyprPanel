import options from 'src/options';
import { module } from '../../shared/module';
import { formatTooltip, inputHandler, renderResourceLabel } from 'src/components/bar/utils/helpers';
import { computeStorage } from './helpers';
import { BarBoxChild, ResourceLabelType } from 'src/lib/types/bar';
import { GenericResourceData } from 'src/lib/types/customModules/generic';
import { LABEL_TYPES } from 'src/lib/types/defaults/bar';
import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';

const { label, labelType, icon, round, leftClick, rightClick, middleClick, pollingInterval } =
    options.bar.customModules.storage;

const defaultStorageData = { total: 0, used: 0, percentage: 0, free: 0 };

const storageUsage = Variable<GenericResourceData>(defaultStorageData);

const storagePoller = new FunctionPoller<GenericResourceData, [Variable<boolean>]>(
    storageUsage,
    [bind(round)],
    bind(pollingInterval),
    computeStorage,
    round,
);

storagePoller.initialize('storage');

export const Storage = (): BarBoxChild => {
    const storageModule = module({
        textIcon: bind(icon),
        label: Variable.derive([bind(storageUsage), bind(labelType), bind(round)], (storage, lblTyp, round) => {
            return renderResourceLabel(lblTyp, storage, round);
        })(),
        tooltipText: bind(labelType).as((lblTyp) => {
            return formatTooltip('Storage', lblTyp);
        }),
        boxClass: 'storage',
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