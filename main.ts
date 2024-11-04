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

const isNixOS = (): boolean => {
    try {
        const osRelease = Utils.exec('cat /etc/os-release').toString();
        console.log(osRelease);

        return osRelease.includes('ID=nixos');
    } catch (error) {
        console.error(error);
        return false;
    }
};

const restartCommand = (): string => {
    const isNix = isNixOS();
    if (isNix) {
        return options.hyprpanel.restartCommand.value.replace(/\bags\b/g, 'hyprpanel');
    }
    return options.hyprpanel.restartCommand.value;
};

hyprland.connect('monitor-added', () => {
    if (options.hyprpanel.restartAgs.value) {
        const restartAgsCommand = restartCommand();
        bash(restartAgsCommand);
    }
});
