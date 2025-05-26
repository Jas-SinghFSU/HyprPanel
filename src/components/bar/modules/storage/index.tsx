import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import options from 'src/configuration';
import { renderResourceLabel } from '../../utils/systemResource';
import { LABEL_TYPES, ResourceLabelType } from 'src/services/system/types';
import { BarBoxChild } from '../../types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import StorageService from 'src/services/system/storage';
import { formatStorageTooltip } from './helpers/tooltipFormatters';

const inputHandler = InputHandlerService.getInstance();

const {
    label,
    labelType,
    icon,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval,
    units,
    tooltipStyle,
    paths,
} = options.bar.customModules.storage;

const storageService = new StorageService({ frequency: pollingInterval, round, pathsToMonitor: paths });

export const Storage = (): BarBoxChild => {
    const tooltipText = Variable('');

    storageService.initialize();

    const labelBinding = Variable.derive(
        [bind(storageService.storage), bind(labelType), bind(paths), bind(tooltipStyle)],
        (storage, lblTyp, filePaths) => {
            const storageUnitToUse = units.get();
            const sizeUnits = storageUnitToUse !== 'auto' ? storageUnitToUse : undefined;

            const tooltipFormatted = formatStorageTooltip(
                filePaths,
                storageService,
                tooltipStyle.get(),
                round.get(),
                sizeUnits,
            );

            tooltipText.set(tooltipFormatted);

            return renderResourceLabel(lblTyp, storage, round.get(), sizeUnits);
        },
    );

    let inputHandlerBindings: Variable<void>;

    const storageModule = Module({
        textIcon: bind(icon),
        label: labelBinding(),
        tooltipText: bind(tooltipText),
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
