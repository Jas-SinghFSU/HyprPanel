import icons from "lib/icons";
import { PowerOptions } from "lib/types/options";
import options from "options";
import powermenu from "../power/helpers/actions";

const { confirmation, shutdown, logout, sleep, reboot, showLabel } = options.menus.power;

export const PowerButton = (action: PowerOptions) => {
    const handleClick = (action: PowerOptions) => {
        const actions = {
            shutdown: shutdown.value,
            reboot: reboot.value,
            logout: logout.value,
            sleep: sleep.value,
        };
        App.closeWindow("powerdropdownmenu");

        if (!confirmation.value) {
            Utils.execAsync(actions[action])
                .catch((err) => console.error(`Failed to execute ${action} command. Error: ${err}`));
        } else {
            powermenu.customAction(action, actions[action]);
        }
    };

    return Widget.Button({
        className: showLabel.bind("value").as(shwLbl => {
            return `power-menu-button ${action} ${!shwLbl ? "no-label" : ""}`;
        }),
        on_clicked: () => handleClick(action),
        child: Widget.Box({
            vertical: false,
            children: showLabel.bind("value").as(shwLbl => {
                if (shwLbl) {
                    return [
                        Widget.Icon({
                            icon: icons.powermenu[action],
                            className: `power-button-icon ${action}-icon`,
                        }),
                        Widget.Label({
                            hpack: "center",
                            hexpand: true,
                            label: action.charAt(0).toUpperCase() + action.slice(1),
                            className: `power-button-label ${action}-label show-label`,
                        }),
                    ];
                }
                return [
                    Widget.Icon({
                        icon: icons.powermenu[action],
                        className: `power-button-icon ${action}-icon no-label`,
                    }),
                ];
            }),
        })
    });
};
