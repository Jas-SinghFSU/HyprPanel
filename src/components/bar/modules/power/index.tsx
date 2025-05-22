import { Module } from '../../shared/module';
import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import { InputHandlerService } from '../../utils/input/inputHandler';
import options from 'src/configuration';

const inputHandler = InputHandlerService.getDefault();

const { icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.power;

export const Power = (): BarBoxChild => {
    const powerModule = Module({
        tooltipText: 'Power Menu',
        textIcon: bind(icon),
        showLabelBinding: bind(Variable(false)),
        boxClass: 'powermodule',
        props: {
            setup: (self: Astal.Button) => {
                inputHandler.attachHandlers(self, {
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
        },
    });

    return powerModule;
};
