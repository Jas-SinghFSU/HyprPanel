import options from "options";
import { module } from "../module"

import { inputHandler } from "customModules/utils";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import { Variable as VariableType } from "types/variable";

const {
    updateCommand,
    label,
    pollingInterval,
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.updates;

export const Updates = () => {
    const pendingUpdates: VariableType<string> = Variable("0",
        {
            poll: [
                pollingInterval.value,
                updateCommand.value,
                (cmdOutput: string) => {
                    return cmdOutput
                },
            ],
        },
    );
    const networkModule = module({
        textIcon: icon.bind("value"),
        tooltipText: "",
        boxClass: "kblayout",
        // labelHook: (self) => {
        //
        // },
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



