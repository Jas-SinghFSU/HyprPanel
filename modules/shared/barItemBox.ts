import { Child } from "lib/types/bar";
import options from "options";

export const BarItemBox = (child: Child) => {
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
            };

            return `bar_item_box_visible ${styleMap[style]} ${Object.hasOwnProperty.call(child, "boxClass") ? child.boxClass : ""}`;
        }),
        child: child.component,
        visible: computeVisible(),
        ...child.props,
    });
};
