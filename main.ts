import 'lib/session';
import 'scss/style';
import 'globals/useTheme';
import 'globals/systray';
import 'globals/dropdown.js';
import 'globals/utilities';

const hyprland = await Service.import('hyprland');
import { Bar } from 'modules/bar/Bar';
import MenuWindows from './modules/menus/main.js';
import SettingsDialog from 'widget/settings/SettingsDialog';
import Notifications from './modules/notifications/index.js';
import { bash, forMonitors } from 'lib/utils';
import options from 'options.js';
import OSD from 'modules/osd/index';

App.config({
    onConfigParsed: () => Utils.execAsync(`python3 ${App.configDir}/services/bluetooth.py`),
    windows: [...MenuWindows, Notifications(), SettingsDialog(), ...forMonitors(Bar), OSD()],
    closeWindowDelay: {
        sideright: 350,
        launcher: 350,
        bar0: 350,
    },
});

/**
 * Function to determine if the current OS is NixOS by parsing /etc/os-release.
 * @returns True if NixOS, false otherwise.
 */
const isNixOS = (): boolean => {
    try {
        const osRelease = Utils.exec('cat /etc/os-release').toString();
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

hyprland.connect('monitor-added', () => {
    if (options.hyprpanel.restartAgs.value) {
        const restartAgsCommand = getRestartCommand();
        bash(restartAgsCommand);
    }
});
