import { App } from 'astal/gtk3';
import { Bar } from 'src/components/bar';
import { forMonitors } from 'src/components/bar/utils/monitors';
import { GdkMonitorService } from 'src/services/display/monitor';
import Notifications from 'src/components/notifications';
import OSD from 'src/components/osd/index';

/**
 * Manages dynamic refresh of monitor-dependent components when monitor configuration changes.
 * Handles bars, notifications, OSD, and other monitor-aware components.
 * Includes debouncing, error recovery, and prevents concurrent refresh operations.
 */
export class BarRefreshManager {
    private static _instance: BarRefreshManager | null = null;
    private _refreshInProgress = false;
    private _pendingRefresh = false;
    private _monitorChangeTimeout: ReturnType<typeof setTimeout> | null = null;

    private constructor() {}

    /**
     * Retrieves the singleton instance of the refresh manager
     * Creates the instance on first access to ensure single point of control
     */
    public static getInstance(): BarRefreshManager {
        if (!BarRefreshManager._instance) {
            BarRefreshManager._instance = new BarRefreshManager();
        }
        return BarRefreshManager._instance;
    }

    /**
     * Processes monitor configuration change events with built-in debouncing
     * Ensures smooth transitions during rapid monitor connect/disconnect scenarios
     *
     * @param event - The type of monitor change event that occurred
     */
    public handleMonitorChange(event: string): void {
        if (this._monitorChangeTimeout !== null) {
            clearTimeout(this._monitorChangeTimeout);
        }

        this._monitorChangeTimeout = setTimeout(() => {
            this._refreshMonitors().catch((error) => {
                console.error(`[MonitorChange] Failed to refresh bars for ${event}:`, error);
            });
            this._monitorChangeTimeout = null;
        }, 300);
    }

    /**
     * Orchestrates the complete refresh of monitor-dependent components
     * Prevents concurrent refreshes and queues pending requests to avoid race conditions
     */
    private async _refreshMonitors(): Promise<void> {
        if (this._refreshInProgress) {
            this._pendingRefresh = true;
            return;
        }

        this._refreshInProgress = true;

        try {
            this._destroyBars();
            this._destroyNotificationWindow();
            this._destroyOsdWindow();

            const gdkMonitorService = GdkMonitorService.getInstance();
            gdkMonitorService.reset();

            await forMonitors(Bar);

            Notifications();
            OSD();
        } catch (error) {
            console.error('[MonitorRefresh] Error during component refresh:', error);
        } finally {
            this._refreshInProgress = false;

            if (this._pendingRefresh) {
                this._pendingRefresh = false;
                setTimeout(() => this._refreshMonitors(), 100);
            }
        }
    }

    /**
     * Destroys all existing bar windows across monitors
     * Identifies bars by their naming convention to ensure complete cleanup
     */
    private _destroyBars(): void {
        const barWindows = App.get_windows().filter((window) => window.name.startsWith('bar-'));
        barWindows.forEach((window) => window?.destroy());
    }

    /**
     * Removes the notifications window from the display
     * Ensures proper cleanup before recreating notifications on new monitor configuration
     */
    private _destroyNotificationWindow(): void {
        const notificationsWindow = App.get_window('notifications-window');
        if (notificationsWindow !== null) {
            notificationsWindow.destroy();
        }
    }

    /**
     * Removes the OSD indicator window from the display
     * Prepares for recreation on the appropriate monitor after configuration changes
     */
    private _destroyOsdWindow(): void {
        const osdWindow = App.get_window('indicator');
        if (osdWindow !== null) {
            osdWindow.destroy();
        }
    }
}
