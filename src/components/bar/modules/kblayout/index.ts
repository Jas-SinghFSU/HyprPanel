const hyprland = await Service.import('hyprland');

import options from 'options';
import { module } from '../../utils/module';

import { inputHandler } from 'src/components/bar/utils/bar';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';
import Button from 'types/widgets/button';
import Label from 'types/widgets/label';
import { getKeyboardLayout } from './getLayout';
import { BarBoxChild } from 'src/lib/types/bar';
import { Attribute, Child } from 'src/lib/types/widget';

const { label, labelType, icon, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.kbLayout;

export const KbInput = (): BarBoxChild => {
    const keyboardModule = module({
        textIcon: icon.bind('value'),
        tooltipText: '',
        labelHook: (self: Label<Gtk.Widget>): void => {
            self.hook(
                hyprland,
                () => {
                    Utils.execAsync('hyprctl devices -j')
                        .then((obj) => {
                            self.label = getKeyboardLayout(obj, labelType.value);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                },
                'keyboard-layout',
            );

            self.hook(labelType, () => {
                Utils.execAsync('hyprctl devices -j')
                    .then((obj) => {
                        self.label = getKeyboardLayout(obj, labelType.value);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            });
        },

        boxClass: 'kblayout',
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
