import { PowerOptions } from 'lib/types/options';
import options from 'options';
import powermenu from '../power/helpers/actions';
import { GButton } from 'lib/types/widget';

const { confirmation, shutdown, logout, sleep, reboot, showLabel } = options.menus.power;

export const PowerButton = (action: PowerOptions): GButton => {
    const handleClick = (action: PowerOptions): void => {
        const actions = {
            shutdown: shutdown.value,
            reboot: reboot.value,
            logout: logout.value,
            sleep: sleep.value,
        };
        App.closeWindow('powerdropdownmenu');

        if (!confirmation.value) {
            Utils.execAsync(actions[action]).catch((err) =>
                console.error(`Failed to execute ${action} command. Error: ${err}`),
            );
        } else {
            powermenu.customAction(action, actions[action]);
        }
    };

    const powerIconMap = {
        shutdown: '󰐥',
        reboot: '󰜉',
        logout: '󰿅',
        sleep: '󰤄',
    };

    return Widget.Button({
        className: showLabel.bind('value').as((shwLbl) => {
            return `power-menu-button ${action} ${!shwLbl ? 'no-label' : ''}`;
        }),
        on_clicked: () => handleClick(action),
        child: Widget.Box({
            vertical: false,
            children: showLabel.bind('value').as((shwLbl) => {
                if (shwLbl) {
                    return [
                        Widget.Label({
                            label: powerIconMap[action],
                            className: `power-button-icon ${action}-icon txt-icon`,
                        }),
                        Widget.Label({
                            hpack: 'center',
                            hexpand: true,
                            label: action.charAt(0).toUpperCase() + action.slice(1),
                            className: `power-button-label ${action}-label show-label`,
                        }),
                    ];
                }
                return [
                    Widget.Label({
                        label: powerIconMap[action],
                        className: `power-button-icon ${action}-icon no-label txt-icon`,
                    }),
                ];
            }),
        }),
    });
};
