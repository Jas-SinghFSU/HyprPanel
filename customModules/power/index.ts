import options from "options";
import { module } from "../module"

import { inputHandler } from "customModules/utils";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";

const {
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.power;

export const Power = () => {
    const powerModule = module({
        tooltipText: "Power Menu",
        textIcon: icon.bind("value"),
        boxClass: "powermodule",
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

    return powerModule;
}
