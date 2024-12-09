import './src/lib/session';
import './src/scss/style';
import './src/globals/useTheme';
import './src/globals/wallpaper';
import './src/globals/systray';
import './src/globals/dropdown';
import './src/globals/utilities';
import './src/components/bar/utils/sideEffects';

import { Bar } from './src/components/bar';
import MenuWindows from './src/components/menus/exports';
// import SettingsDialog from 'widget/settings/SettingsDialog';
import Notifications from './src/components/notifications';
import { bash, forMonitors, warnOnLowBattery } from 'src/lib/utils';
import options from 'src/options';
import OSD from 'src/components/osd/index';
import { App } from 'astal/gtk3';
import { GtkWidget } from 'src/lib/types/widget.js';
import { exec, execAsync } from 'astal';
import { hyprlandService } from 'src/lib/constants/services';

App.start({
    main() {
        execAsync(`python3 ${SRC}/src/services/bluetooth.py`).catch((err) => console.error(err));
        warnOnLowBattery();

        MenuWindows.forEach((window) => window());
        Notifications();
        // SettingsDialog();
        OSD();
        forMonitors(Bar).forEach((bar: GtkWidget) => bar);
    },
});

/**
 * Function to determine if the current OS is NixOS by parsing /etc/os-release.
 * @returns True if NixOS, false otherwise.
 */
const isNixOS = (): boolean => {
    try {
        const osRelease = exec('cat /etc/os-release').toString();
        const idMatch = osRelease.match(/^ID\s*=\s*"?([^"\n]+)"?/m);

        if (idMatch && idMatch[1].toLowerCase() === 'nixos') {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error detecting OS:', error);
        return false;
    }
};

/**
 * Function to generate the appropriate restart command based on the OS.
 * @returns The modified or original restart command.
 */
const getRestartCommand = (): string => {
    const isNix = isNixOS();
    const command = options.hyprpanel.restartCommand.value;

    if (isNix) {
        return command.replace(/\bags\b/g, 'hyprpanel');
    }

    return command;
};

hyprlandService.connect('monitor-added', () => {
    if (options.hyprpanel.restartAgs.value) {
        const restartAgsCommand = getRestartCommand();
        bash(restartAgsCommand);
    }
});
