import { execAsync } from 'astal';
import { Bar } from 'src/components/bar';
import Notifications from 'src/components/notifications';
import SettingsDialog from 'src/components/settings/index';
import OSD from 'src/components/osd/index';
import { handleRealization } from 'src/components/menus/shared/dropdown/helpers/helpers';
import { isDropdownMenu } from 'src/components/settings/constants.js';
import { initializeSystemBehaviors } from 'src/core/behaviors';
import { DropdownMenus, StandardWindows } from 'src/components/menus';
import { forMonitors } from 'src/components/bar/utils/monitors';
import { BarRefreshManager } from 'src/services/display/bar/refreshManager';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { Timer } from 'src/lib/performance/timer';
import { JSXElement } from 'src/core/types';

/**
 * Manages the complete initialization sequence for HyprPanel.
 * Coordinates startup scripts, component initialization, and system behaviors.
 */
export class InitializationService {
    /**
     * Performs the complete application initialization sequence
     */
    public static async initialize(): Promise<void> {
        try {
            const overallTimer = new Timer('HyprPanel initialization');

            await Timer.measureAsync('Startup scripts', () => this._initializeStartupScripts());

            Timer.measureSync('Notifications', () => Notifications());
            Timer.measureSync('OSD', () => OSD());

            await Timer.measureAsync('Bars', async () => {
                const bars = await forMonitors(Bar);
                bars.forEach((bar: JSXElement) => bar);
                return bars;
            });

            Timer.measureSync('Settings dialog', () => SettingsDialog());
            Timer.measureSync('Menus', () => this._initializeMenus());
            Timer.measureSync('System behaviors', () => initializeSystemBehaviors());
            Timer.measureSync('Monitor handlers', () => this._setupMonitorHandlers());

            overallTimer.end();
        } catch (error) {
            console.error('Error during application initialization:', error);
        }
    }

    /**
     * Initializes all startup scripts required by the application
     */
    private static async _initializeStartupScripts(): Promise<void> {
        try {
            execAsync(`python3 ${SRC_DIR}/scripts/bluetooth.py`).catch((err) =>
                console.error('Failed to initialize bluetooth script:', err),
            );
        } catch (error) {
            console.error('Failed to initialize bluetooth script:', error);
        }
    }

    /**
     * Initializes all menu components
     */
    private static _initializeMenus(): void {
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
    }

    /**
     * Sets up monitor change event handlers
     */
    private static _setupMonitorHandlers(): void {
        const hyprland = AstalHyprland.get_default();
        const barRefreshManager = BarRefreshManager.getInstance();

        hyprland.connect('monitor-added', () => barRefreshManager.handleMonitorChange('added'));
        hyprland.connect('monitor-removed', () => barRefreshManager.handleMonitorChange('removed'));
    }
}
