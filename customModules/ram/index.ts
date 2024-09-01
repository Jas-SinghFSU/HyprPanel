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
import { RamLabelType } from "lib/types/bar";

// All the user configurable options for the ram module that are needed
const {
    label,
    labelType,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval
} = options.bar.customModules.ram;

// Ram module
export const Ram = () => {
    /**
    * For more information on the Variable class, see the documentation at
    * https://aylur.github.io/ags-docs/config/reactivity/#property-bindings
    */
    const defaultRamData: RamData = { total: 0, used: 0, percentage: 0 };

    const ramUsage = Variable(
        // initial values
        defaultRamData,
        {
            poll: [
                //polling interval
                pollingInterval.value,
                //cli command
                "free",
                // callback function to calculate the ram usage
                (commandExecutionOutput) => {
                    return calculateRamUsage(commandExecutionOutput, round);
                },
            ],
        },
    );

    const labelTypes: RamLabelType[] = ["mem/total", "memory", "percentage"];

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
        label: Utils.merge([ramUsage.bind("value"), labelType.bind("value")], (rmUsg, lblType) => renderLabel(lblType, rmUsg)),
        tooltipText: "RAM",
        boxClass: "ram",
        showLabel: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                        fn: () => { }
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                        fn: () => { }
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        fn: () => {
                            labelType.value = labelTypes[(labelTypes.indexOf(labelType.value) + 1) % labelTypes.length] as RamLabelType;
                        }
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.value = labelTypes[(labelTypes.indexOf(labelType.value) - 1 + labelTypes.length) % labelTypes.length] as RamLabelType;
                        }
                    },
                });
            },
        }
    });

    return ramModule;
}
