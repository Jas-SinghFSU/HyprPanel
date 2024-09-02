const hyprland = await Service.import("hyprland");

import options from "options";
import { module } from "../../modules/bar/module"

import { inputHandler } from "customModules/utils";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import Label from "types/widgets/label";
import { Hook } from "lib/types/bar";
import { getKeyboardLayout } from "./getLayout";

const {
    label,
    labelType,
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.kbLayout;

export const KbInput = () => {
    const networkModule = module({
        textIcon: icon.bind("value"),
        tooltipText: "",
        labelHooks: [
            (self: Label<Gtk.Widget>) => {
                self.hook(hyprland, () => {
                    Utils.execAsync('hyprctl devices -j')
                        .then((obj) => {
                            self.label = getKeyboardLayout(obj, labelType.value);
                        })
                        .catch((err) => { console.error(err); });
                }, "keyboard-layout");

                self.hook(labelType, () => {
                    Utils.execAsync('hyprctl devices -j')
                        .then((obj) => {
                            self.label = getKeyboardLayout(obj, labelType.value);
                        })
                        .catch((err) => { console.error(err); });
                });
            }
        ] as Hook[],
        boxClass: "kblayout",
        showLabel: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
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

    return networkModule;
}


