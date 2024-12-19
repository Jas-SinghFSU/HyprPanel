import { hyprlandService } from 'src/lib/constants/services';
import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { getKeyboardLayout } from './helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { bind, execAsync } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import { Astal } from 'astal/gtk3';

const { label, labelType, icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.kbLayout;

export const KbInput = (): BarBoxChild => {
    const keyboardModule = Module({
        textIcon: bind(icon),
        tooltipText: '',
        labelHook: (self: Astal.Label): void => {
            useHook(
                self,
                hyprlandService,
                () => {
                    execAsync('hyprctl devices -j')
                        .then((obj) => {
                            self.label = getKeyboardLayout(obj, labelType.get());
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                },
                'keyboard-layout',
            );

            useHook(self, labelType, () => {
                execAsync('hyprctl devices -j')
                    .then((obj) => {
                        self.label = getKeyboardLayout(obj, labelType.get());
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
        },
        boxClass: 'kblayout',
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
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
        },
    });

    return keyboardModule;
};
