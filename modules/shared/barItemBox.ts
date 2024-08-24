import Gtk from "gi://Gtk?version=3.0";
import { Child } from "lib/types/bar";
import options from "options";
import { ButtonProps } from "types/widgets/button";

export const BarItemBox = (child: Child): ButtonProps<Gtk.Widget> => {
    const computeVisible = () => {
        if (child.isVis !== undefined) {
            return child.isVis.bind("value");
        }
        return child.isVisible;
    };

    return Widget.Button({
        class_name: options.theme.bar.buttons.style.bind("value").as((style) => {
            const styleMap = {
                default: "style1",
                split: "style2",
                wave: "style3",
                wave2: "style4",
            };

            return `bar_item_box_visible ${styleMap[style]} ${Object.hasOwnProperty.call(child, "boxClass") ? child.boxClass : ""}`;
        }),
        child: child.component,
        visible: computeVisible(),
        ...child.props,
    });
};
