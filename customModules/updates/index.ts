import options from "options";
import { module } from "../module"

import { inputHandler } from "customModules/utils";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import { Variable as VariableType } from "types/variable";
import { pollVariableBash } from "customModules/PollVar";

const {
    updateCommand,
    label,
    padZero,
    pollingInterval,
    icon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.updates;

const pendingUpdates: VariableType<string> = Variable(" 0");

const processUpdateCount = (updateCount: string) => {
    if (!padZero.value) return updateCount;
    return `${updateCount.padStart(2, '0')}`;
}

pollVariableBash(
    pendingUpdates,
    [padZero.bind('value')],
    pollingInterval.bind('value'),
    `bash -c "${updateCommand.value}"`,
    processUpdateCount,
);

export const Updates = () => {
    const updatesModule = module({
        textIcon: icon.bind("value"),
        tooltipText: pendingUpdates.bind("value").as(v => `${v} updates available`),
        boxClass: "updates",
        label: pendingUpdates.bind("value"),
        showLabelBinding: label.bind("value"),
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

    return updatesModule;
}



