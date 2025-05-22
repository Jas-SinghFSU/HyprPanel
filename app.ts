import './src/lib/session';
import './src/style';
import 'src/core/behaviors/bar';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { Bar } from './src/components/bar';
import Notifications from './src/components/notifications';
import SettingsDialog from './src/components/settings/index';
import OSD from 'src/components/osd/index';
import { App } from 'astal/gtk3';
import { execAsync } from 'astal';
import { handleRealization } from 'src/components/menus/shared/dropdown/helpers/helpers';
import { isDropdownMenu } from 'src/lib/constants/options.js';
import { initializeSystemBehaviors } from 'src/core/behaviors';
import { runCLI } from 'src/services/cli/commander';
import { DropdownMenus, StandardWindows } from 'src/components/menus';
import { forMonitors } from 'src/components/bar/utils/monitors';
import options from 'src/configuration';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

const hyprland = AstalHyprland.get_default();
const initializeStartupScripts = (): void => {
    execAsync(`python3 ${SRC_DIR}/scripts/bluetooth.py`).catch((err) => 
        console.error('Failed to initialize bluetooth script:', err)
    );
};

const initializeMenus = (): void => {
    StandardWindows.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        return window();
    });

    DropdownMenus.forEach((window) => {
        const windowName = window.name
            .replace(/_default.*/, '')
            .concat('menu')
            .toLowerCase();

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
    async main() {
        try {
            initializeStartupScripts();

            Notifications();
            OSD();

            const barsForMonitors = await forMonitors(Bar);
            barsForMonitors.forEach((bar: JSX.Element) => bar);

            SettingsDialog();
            initializeMenus();

            initializeSystemBehaviors();
        } catch (error) {
            console.error('Error during application initialization:', error);
        }
    },
});

hyprland.connect('monitor-added', () => {
    const { restartCommand } = options.hyprpanel;

    if (options.hyprpanel.restartAgs.get()) {
        SystemUtilities.bash(restartCommand.get());
    }
});
