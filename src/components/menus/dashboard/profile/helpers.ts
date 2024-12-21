import { App } from 'astal/gtk3';
import powermenu from '../../power/helpers/actions.js';
import { PowerOptions } from 'src/lib/types/options.js';
import { execAsync } from 'astal/process.js';
const { confirmation, shutdown, logout, sleep, reboot } = options.menus.dashboard.powermenu;

/**
 * Handles the click event for power options.
 *
 * This function executes the appropriate action based on the provided power option.
 * It hides the dashboard menu and either executes the action directly or shows a confirmation dialog.
 *
 * @param action The power option to handle (shutdown, reboot, logout, sleep).
 */
export const handleClick = (action: PowerOptions): void => {
    const actions = {
        shutdown: shutdown.get(),
        reboot: reboot.get(),
        logout: logout.get(),
        sleep: sleep.get(),
    };
    App.get_window('dashboardmenu')?.set_visible(false);

    if (!confirmation.get()) {
        execAsync(actions[action]).catch((err) => console.error(`Failed to execute ${action} command. Error: ${err}`));
    } else {
        powermenu.action(action);
    }
};
