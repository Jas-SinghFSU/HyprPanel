import icons from "../../../icons/index.js";
import powermenu from "../../power/helpers/actions.js";
import { PowerOptions } from "lib/types/options.js";
import GdkPixbuf from "gi://GdkPixbuf";

import options from "options";
const { image, name } = options.menus.dashboard.powermenu.avatar;
const { confirmation, shutdown, logout, sleep, reboot } = options.menus.dashboard.powermenu;

const Profile = () => {
    const handleClick = (action: PowerOptions) => {
        const actions = {
            shutdown: shutdown.value,
            reboot: reboot.value,
            logout: logout.value,
            sleep: sleep.value,
        };
        App.closeWindow("dashboardmenu");

        if (!confirmation.value) {
            Utils.execAsync(actions[action])
                .catch((err) => console.error(`Failed to execute ${action} command. Error: ${err}`));
        } else {
            powermenu.action(action);
        }
    };

    return Widget.Box({
        class_name: "profiles-container",
        hpack: "fill",
        hexpand: true,
        children: [
            Widget.Box({
                class_name: "profile-picture-container dashboard-card",
                hexpand: true,
                vertical: true,
                children: [
                    Widget.Icon({
                        hpack: "center",
                        class_name: "profile-picture",
                        icon: image.bind("value").as(i => {
                            try {
                                GdkPixbuf.Pixbuf.new_from_file(i);
                                return i;
                            } catch {
                                return "avatar-default-symbolic";
                            }
                        }),
                    }),
                    Widget.Label({
                        hpack: "center",
                        class_name: "profile-name",
                        label: name.bind("value").as((v) => {
                            if (v === "system") {
                                return Utils.exec("bash -c whoami");
                            }
                            return v;
                        }),
                    }),
                ],
            }),
            Widget.Box({
                class_name: "power-menu-container dashboard-card",
                vertical: true,
                vexpand: true,
                children: [
                    Widget.Button({
                        class_name: "dashboard-button shutdown",
                        on_clicked: () => handleClick("shutdown"),
                        tooltip_text: "Shut Down",
                        vexpand: true,
                        child: Widget.Icon(icons.powermenu.shutdown),
                    }),
                    Widget.Button({
                        class_name: "dashboard-button restart",
                        on_clicked: () => handleClick("reboot"),
                        tooltip_text: "Restart",
                        vexpand: true,
                        child: Widget.Icon(icons.powermenu.reboot),
                    }),
                    Widget.Button({
                        class_name: "dashboard-button lock",
                        on_clicked: () => handleClick("logout"),
                        tooltip_text: "Log Out",
                        vexpand: true,
                        child: Widget.Icon(icons.powermenu.logout),
                    }),
                    Widget.Button({
                        class_name: "dashboard-button sleep",
                        on_clicked: () => handleClick("sleep"),
                        tooltip_text: "Sleep",
                        vexpand: true,
                        child: Widget.Icon(icons.powermenu.sleep),
                    }),
                ],
            }),
        ],
    });
};

export { Profile };
