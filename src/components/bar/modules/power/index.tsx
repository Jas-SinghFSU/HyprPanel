import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { bind } from 'astal';
import { Astal } from 'astal/gtk3';

const { icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } = options.bar.customModules.power;

export const Power = (): BarBoxChild => {
    const powerModule = Module({
        tooltipText: 'Power Menu',
        textIcon: bind(icon),
        boxClass: 'powermodule',
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
