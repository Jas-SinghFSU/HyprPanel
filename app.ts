import './src/lib/session';
import './src/scss/style';
import './src/globals/useTheme';
import './src/globals/wallpaper';
import './src/globals/systray';
import './src/globals/dropdown';
import './src/globals/utilities';
import './src/components/bar/utils/sideEffects';

import { Bar } from './src/components/bar';
import { DropdownMenus, StandardWindows } from './src/components/menus/exports';
import Notifications from './src/components/notifications';
import SettingsDialog from './src/components/settings/index';
import { bash, forMonitors } from 'src/lib/utils';
import options from 'src/options';
import OSD from 'src/components/osd/index';
import { App } from 'astal/gtk3';
import { exec, execAsync } from 'astal';
import { hyprlandService } from 'src/lib/constants/services';
import { handleRealization } from 'src/components/menus/shared/dropdown/helpers';
import { isDropdownMenu } from 'src/lib/constants/options.js';
import { initializeSystemBehaviors } from 'src/lib/behaviors';
import { runCLI } from 'src/cli/commander';

const initializeStartupScripts = (): void => {
    execAsync(`python3 ${SRC}/src/services/bluetooth.py`).catch((err) => console.error(err));
};

const initializeMenus = (): void => {
    StandardWindows.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        const windowName = window.name.replace('_default', '').concat('menu').toLowerCase();

        if (!isDropdownMenu(windowName)) {
            return;
        }

        handleRealization(windowName);
    });
};

App.start({
    instanceName: 'hyprpanel',
    requestHandler(request: string, res: (response: unknown) => void) {
        runCLI(request, res);
    },
    main() {
        initializeStartupScripts();

        Notifications();
        SettingsDialog();
        OSD();
        forMonitors(Bar).forEach((bar: JSX.Element) => bar);
        initializeMenus();

        initializeSystemBehaviors();
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
    const command = options.hyprpanel.restartCommand.get();

    if (isNix) {
        return command.replace(/\bags\b/g, 'hyprpanel');
    }

    return command;
};

hyprlandService.connect('monitor-added', () => {
    if (options.hyprpanel.restartAgs.get()) {
        const restartAgsCommand = getRestartCommand();
        bash(restartAgsCommand);
    }
});
