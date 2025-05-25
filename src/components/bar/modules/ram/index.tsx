import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { renderResourceLabel, formatTooltip } from '../../utils/systemResource';
import { InputHandlerService } from '../../utils/input/inputHandler';
import { GenericResourceData, ResourceLabelType, LABEL_TYPES } from 'src/services/system/types';
import RamUsageService from 'src/services/system/ramUsage';

const inputHandler = InputHandlerService.getInstance();

const { label, labelType, round, leftClick, rightClick, middleClick, pollingInterval, icon } =
    options.bar.customModules.ram;

const ramService = new RamUsageService({ frequency: pollingInterval });

export const Ram = (): BarBoxChild => {
    ramService.initialize();

    const labelBinding = Variable.derive(
        [bind(ramService.ram), bind(labelType), bind(round)],
        (rmUsg: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
            const returnValue = renderResourceLabel(lblTyp, rmUsg, round);

            return returnValue;
        },
    );

    let inputHandlerBindings: Variable<void>;

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
                ramService.destroy();
            },
        },
    });

    return ramModule;
};
