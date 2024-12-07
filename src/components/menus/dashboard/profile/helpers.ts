import { App } from 'astal/gtk3';
import powermenu from '../../power/helpers/actions.js';
import { PowerOptions } from 'src/lib/types/options.js';
import { execAsync } from 'astal/process.js';
const { confirmation, shutdown, logout, sleep, reboot } = options.menus.dashboard.powermenu;

export const handleClick = (action: PowerOptions): void => {
    const actions = {
        shutdown: shutdown.value,
        reboot: reboot.value,
        logout: logout.value,
        sleep: sleep.value,
    };
    App.get_window('dashboardmenu')?.set_visible(false);

    if (!confirmation.value) {
        execAsync(actions[action]).catch((err) => console.error(`Failed to execute ${action} command. Error: ${err}`));
    } else {
        powermenu.action(action);
    }
};
