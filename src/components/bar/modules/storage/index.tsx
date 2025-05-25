import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import options from 'src/configuration';
import { renderResourceLabel, formatTooltip } from '../../utils/systemResource';
import { LABEL_TYPES, ResourceLabelType } from 'src/services/system/types';
import { BarBoxChild } from '../../types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import StorageService from 'src/services/system/storage';

const inputHandler = InputHandlerService.getInstance();

const { label, labelType, icon, round, leftClick, rightClick, middleClick, pollingInterval } =
    options.bar.customModules.storage;

const storageService = new StorageService({ frequency: pollingInterval });

export const Storage = (): BarBoxChild => {
    console.log('re-rendering');
    storageService.initialize();

    const labelBinding = Variable.derive(
        [bind(storageService.storage), bind(labelType), bind(round)],
        (storage, lblTyp, round) => {
            return renderResourceLabel(lblTyp, storage, round);
        },
    );
    let inputHandlerBindings: Variable<void>;

    const storageModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: bind(labelType).as((lblTyp) => {
            return formatTooltip('Storage', lblTyp);
        }),
        boxClass: 'storage',
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
                inputHandlerBindings.drop();
                labelBinding.drop();
            },
        },
    });

    return storageModule;
};
