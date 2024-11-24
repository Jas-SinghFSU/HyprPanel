import './lib/session';
// import 'scss/style';
// import 'globals/useTheme';
// import 'globals/wallpaper';
// import 'globals/systray';
// import 'globals/dropdown.js';
// import 'globals/utilities';

import Hyprland from 'gi://AstalHyprland';
import { Bar } from 'modules/bar/Bar';
// import MenuWindows from './modules/menus/main.js';
// import SettingsDialog from 'widget/settings/SettingsDialog';
// import Notifications from './modules/notifications/index.js';
import { bash, forMonitors, warnOnLowBattery } from 'lib/utils';
// import options from 'options.js';
// import OSD from 'modules/osd/index';
import { App } from 'astal/gtk3';
import { execAsync, exec } from 'astal/process.js';

const hyprland = Hyprland.get_default();

execAsync(`python3 ${SRC}/services/bluetooth.py`);

// warnOnLowBattery();
App.start({
    main() {
        // MenuWindows.forEach((window) => window());
        // Notifications();
        // SettingsDialog();
        // OSD();
        Bar();
        // forMonitors(Bar).forEach((bar) => bar());
    },
});

///**
// * Function to determine if the current OS is NixOS by parsing /etc/os-release.
// * @returns True if NixOS, false otherwise.
// */
//const isNixOS = (): boolean => {
//    try {
//        const osRelease = exec('cat /etc/os-release').toString();
//        const idMatch = osRelease.match(/^ID\s*=\s*"?([^"\n]+)"?/m);
//
//        if (idMatch && idMatch[1].toLowerCase() === 'nixos') {
//            return true;
//        }
//
//        return false;
//    } catch (error) {
//        console.error('Error detecting OS:', error);
//        return false;
//    }
//};
//
///**
// * Function to generate the appropriate restart command based on the OS.
// * @returns The modified or original restart command.
// */
//const getRestartCommand = (): string => {
//    const isNix = isNixOS();
//    const command = options.hyprpanel.restartCommand.value;
//
//    if (isNix) {
//        return command.replace(/\bags\b/g, 'hyprpanel');
//    }
//
//    return command;
//};
//
//hyprland.connect('monitor-added', () => {
//    if (options.hyprpanel.restartAgs.value) {
//        const restartAgsCommand = getRestartCommand();
//        bash(restartAgsCommand);
//    }
//});
