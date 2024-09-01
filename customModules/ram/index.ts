import options from "options";
import { module } from "../../modules/bar/module"
import { RamData } from "lib/types/customModules/ram";
import { scrollHandler } from "customModules/utils";
import Button from "types/widgets/button";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { calculateRamUsage } from "./computeRam";

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

export const Ram = () => {

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
        /* 
         * Utils.merge is a function that takes an array of variable bindings and a callback
         * function.
         *
         * varName.bind("value") is a way to connect to a variable's value so that
         * the label updates when the variable changes.
        **/
        label: Utils.merge([ramUsage.bind("value"), labelType.bind("value")], (rmUsg, lblType) => renderLabel(lblType, rmUsg)),
        tooltipText: "RAM",
        boxClass: "ram",
        showLabel: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                scrollHandler(self, {
                    onPrimaryClick: leftClick.value,
                    onSecondaryClick: rightClick.value,
                    onMiddleClick: middleClick.value,
                    onScrollUp: scrollUp.value,
                    onScrollDown: scrollDown.value,
                });
            },
        }
    });

    return ramModule;
}
