import options from "options";

// Module initializer
import { module } from "../../modules/bar/module"

// Types
import { RamData } from "lib/types/customModules/ram";
import Button from "types/widgets/button";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

// Helper Methods
import { calculateRamUsage } from "./computeRam";

// Utility Methods
import { inputHandler } from "customModules/utils";

// All the user configurable options for the ram module that are needed
const {
    label,
    labelType,
    round,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown
} = options.bar.customModules.ram;

// Ram module
export const Ram = () => {
    /**
    * For more information on the Variable class, see the documentation at
    * https://aylur.github.io/ags-docs/config/reactivity/#property-bindings
    */
    const ramUsage = Variable(
        // initial values
        { total: 0, used: 0, percentage: 0 },
        {
            poll: [
                //polling interval
                2000,
                //cli command
                "free",
                // callback function to calculate the ram usage
                (commandExecutionOutput) => {
                    return calculateRamUsage(commandExecutionOutput, round);
                },
            ],
        },
    );

    const renderLabel = (lblType: string, rmUsg: RamData) => {
        if (lblType === "mem/total") {
            return `${rmUsg.used}/${rmUsg.total} GB`;
        }
        if (lblType === "memory") {
            return `${rmUsg.used} GB`;
        }
        return `${rmUsg.percentage}%`;
    }

    const ramModule = module({
        textIcon: "",
        /**
        * Utils.merge is a function that takes an array of variable bindings and a callback
        * function.
        *
        * varName.bind("value") is a way to connect to a variable's value so that
        * the label updates when the variable changes.
        */
        label: Utils.merge([ramUsage.bind("value"), labelType.bind("value")], (rmUsg, lblType) => renderLabel(lblType, rmUsg)),
        // tooltip text for the module when hovered
        tooltipText: "RAM",
        // unique class name for the module
        boxClass: "ram",
        // 'label' is a boolean variable that determines whether the label should be shown
        showLabel: label.bind("value"),
        // additional properties that can be passed to the module
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        // command to run on left click
                        cmd: leftClick.value,
                        // function to run on command's output
                        fn: () => { }
                    },
                    onSecondaryClick: {
                        cmd: rightClick.value,
                        fn: () => { }
                    },
                    onMiddleClick: {
                        cmd: middleClick.value,
                        fn: () => { }
                    },
                    onScrollUp: {
                        cmd: scrollUp.value,
                        fn: () => { }
                    },
                    onScrollDown: {
                        cmd: scrollDown.value,
                        fn: () => { }
                    },
                });
            },
        }
    });

    return ramModule;
}
