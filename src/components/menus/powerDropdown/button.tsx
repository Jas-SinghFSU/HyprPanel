import { PowerOptions } from 'src/lib/types/options';
import { capitalizeFirstLetter } from 'src/lib/utils';
import options from 'src/options';
import powermenu from '../power/helpers/actions';
import { App, Gtk } from 'astal/gtk3';
import { bind, execAsync } from 'astal';

const { confirmation, shutdown, logout, sleep, reboot, showLabel } = options.menus.power;

export const PowerButton = (action: PowerOptions): JSX.Element => {
    const handleClick = (action: PowerOptions): void => {
        const actions = {
            shutdown: shutdown.get(),
            reboot: reboot.get(),
            logout: logout.get(),
            sleep: sleep.get(),
        };
        App.get_window('powerdropdownmenu')?.set_visible(false);

        if (!confirmation.get()) {
            execAsync(actions[action]).catch((err) =>
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

    return (
        <button
            className={bind(showLabel).as((showLbl) => `power-menu-button ${action} ${!showLbl ? 'no-label' : ''}`)}
            onClicked={() => handleClick(action)}
        >
            <box vertical={false}>
                {bind(showLabel).as((showLbl) => {
                    if (showLbl) {
                        return [
                            <label
                                className={`power-button-icon ${action}-icon txt-icon`}
                                label={powerIconMap[action]}
                            />,
                            <label
                                halign={Gtk.Align.CENTER}
                                hexpand
                                className={`power-button-label ${action}-label show-label`}
                                label={capitalizeFirstLetter(action)}
                            />,
                        ];
                    }
                    return [
                        <label
                            className={`power-button-icon ${action}-icon no-label txt-icon`}
                            label={powerIconMap[action]}
                        />,
                    ];
                })}
            </box>
        </button>
    );
};
