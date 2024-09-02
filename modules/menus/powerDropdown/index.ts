import options from "options.js";
import DropdownMenu from "../DropdownMenu.js";
import { PowerButton } from "./button.js";

const { showLabel } = options.menus.power;

export default () => {
    return DropdownMenu({
        name: "powerdropdownmenu",
        transition: "crossfade",
        child: Widget.Box({
            class_name: "menu-items power-dropdown",
            child: Widget.Box({
                vertical: true,
                hexpand: true,
                class_name: "menu-items-container power-dropdown",
                children: [
                    PowerButton('shutdown'),
                    PowerButton('reboot'),
                    PowerButton('logout'),
                    PowerButton('sleep'),
                ],
            }),
        }),
    });
};

