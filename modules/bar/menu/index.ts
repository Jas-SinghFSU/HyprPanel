import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from "../utils.js";
import options from "options";

const Menu = () => {
    return {
        component: Widget.Box({
            child: Widget.Label({
                class_name: "bar-menu_label",
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
