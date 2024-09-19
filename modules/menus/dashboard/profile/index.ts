import powermenu from '../../power/helpers/actions.js';
import { PowerOptions } from 'lib/types/options.js';
import GdkPixbuf from 'gi://GdkPixbuf';

import options from 'options';
import { BoxWidget, Child } from 'lib/types/widget.js';
import Label from 'types/widgets/label.js';
const { image, name } = options.menus.dashboard.powermenu.avatar;
const { confirmation, shutdown, logout, sleep, reboot } = options.menus.dashboard.powermenu;

const Profile = (): BoxWidget => {
    const handleClick = (action: PowerOptions): void => {
        const actions = {
            shutdown: shutdown.value,
            reboot: reboot.value,
            logout: logout.value,
            sleep: sleep.value,
        };
        App.closeWindow('dashboardmenu');

        if (!confirmation.value) {
            Utils.execAsync(actions[action]).catch((err) =>
                console.error(`Failed to execute ${action} command. Error: ${err}`),
            );
        } else {
            powermenu.action(action);
        }
    };

    const getIconForButton = (txtIcon: string): Label<Child> => {
        return Widget.Label({
            className: 'txt-icon',
            label: txtIcon,
        });
    };

    return Widget.Box({
        class_name: 'profiles-container',
        hpack: 'fill',
        hexpand: true,
        children: [
            Widget.Box({
                class_name: 'profile-picture-container dashboard-card',
                hexpand: true,
                vertical: true,
                children: [
                    Widget.Box({
                        hpack: 'center',
                        class_name: 'profile-picture',
                        css: image.bind('value').as((i) => {
                            try {
                                GdkPixbuf.Pixbuf.new_from_file(i);
                                return `background-image: url("${i}")`;
                            } catch {
                                return `background-image: url("${App.configDir}/assets/hyprpanel.png")`;
                            }
                        }),
                    }),
                    Widget.Label({
                        hpack: 'center',
                        class_name: 'profile-name',
                        label: name.bind('value').as((v) => {
                            if (v === 'system') {
                                return Utils.exec('bash -c whoami');
                            }
                            return v;
                        }),
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'power-menu-container dashboard-card',
                vertical: true,
                vexpand: true,
                children: [
                    Widget.Button({
                        class_name: 'dashboard-button shutdown',
                        on_clicked: () => handleClick('shutdown'),
                        tooltip_text: 'Shut Down',
                        vexpand: true,
                        child: getIconForButton('󰐥'),
                    }),
                    Widget.Button({
                        class_name: 'dashboard-button restart',
                        on_clicked: () => handleClick('reboot'),
                        tooltip_text: 'Restart',
                        vexpand: true,
                        child: getIconForButton('󰜉'),
                    }),
                    Widget.Button({
                        class_name: 'dashboard-button lock',
                        on_clicked: () => handleClick('logout'),
                        tooltip_text: 'Log Out',
                        vexpand: true,
                        child: getIconForButton('󰿅'),
                    }),
                    Widget.Button({
                        class_name: 'dashboard-button sleep',
                        on_clicked: () => handleClick('sleep'),
                        tooltip_text: 'Sleep',
                        vexpand: true,
                        child: getIconForButton('󰤄'),
                    }),
                ],
            }),
        ],
    });
};

export { Profile };
