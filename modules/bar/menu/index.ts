import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from "../utils.js";
import options from "options";

const Menu = () => {
    return {
        component: Widget.Box({
            className: Utils.merge([options.theme.bar.buttons.style.bind("value")], (style) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };
                return `dashboard ${styleMap[style]}`;
            }),
            child: Widget.Label({
                class_name: "bar-menu_label bar-button_icon txt-icon bar",
                label: options.bar.launcher.icon.bind("value"),
            }),
        }),
        isVisible: true,
        boxClass: "dashboard",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "dashboardmenu");
            },
        },
    };
};

export { Menu };
