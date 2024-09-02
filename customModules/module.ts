import { Module } from "lib/types/bar";
import options from "options";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { Binding } from "types/service";
import { Variable as VariableType } from "types/variable";

const { style } = options.theme.bar.buttons;

export const module = ({
    icon,
    textIcon,
    label,
    tooltipText,
    boxClass,
    props = {},
    showLabel,
    labelHook,
    hook
}: Module) => {
    const getIconWidget = () => {
        let iconWidget: Gtk.Widget | undefined;

        if (icon !== undefined) {
            iconWidget = Widget.Icon({
                class_name: `bar-button-icon module-icon ${boxClass}`,
                icon: icon
            }) as unknown as Gtk.Widget;
        } else if (textIcon !== undefined) {
            iconWidget = Widget.Label({
                class_name: `bar-button-icon module-icon ${boxClass}`,
                label: textIcon
            }) as unknown as Gtk.Widget;
        }

        return iconWidget;
    }

    return {
        component: Widget.Box({
            className: Utils.merge([style.bind("value"), showLabel], (style: string, shwLabel: boolean) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };
                return `${boxClass} ${styleMap[style]} ${!shwLabel ? "no-label" : ""}`;
            }),
            tooltip_text: tooltipText,
            children: Utils.merge(
                [showLabel],
                (showLabel): Gtk.Widget[] => {
                    const childrenArray: Gtk.Widget[] = [];
                    const iconWidget = getIconWidget();

                    if (iconWidget !== undefined) {
                        childrenArray.push(iconWidget);
                    }

                    if (showLabel) {
                        childrenArray.push(
                            Widget.Label({
                                class_name: `bar-button-label module-label ${boxClass}`,
                                label: label,
                                setup: labelHook,
                            }) as unknown as Gtk.Widget
                        );
                    }
                    return childrenArray;
                }
            ) as Binding<VariableType<Gtk.Widget[]>, any, Gtk.Widget[]>,
            setup: hook,
        }),
        tooltip_text: tooltipText,
        isVisible: true,
        boxClass,
        props
    };
};
