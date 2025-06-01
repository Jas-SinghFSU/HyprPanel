import { App, Gtk } from 'astal/gtk3';
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
     * Gets the singleton instance of BarRefreshManager
     */
    public static getInstance(): BarRefreshManager {
        if (!BarRefreshManager._instance) {
            BarRefreshManager._instance = new BarRefreshManager();
        }
        return BarRefreshManager._instance;
    }

    /**
     * Handles monitor configuration changes with debouncing to prevent rapid refreshes
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
     * Refreshes all monitor-dependent components by destroying existing ones and creating new ones
     * for all currently connected monitors
     */
    private async _refreshMonitors(): Promise<void> {
        if (this._refreshInProgress) {
            this._pendingRefresh = true;
            return;
        }

        this._refreshInProgress = true;

        try {
            const windows = App.get_windows();

            this._destroyBars(windows);
            this._destroyNotificationWindow(windows);
            this._destroyOsdWindow(windows);

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

    private _destroyBars(windows: Gtk.Window[]): void {
        const barWindows = windows.filter((w) => w.name?.startsWith('bar-'));
        for (const window of barWindows) {
            try {
                window?.destroy();
            } catch (error) {
                console.warn(`[MonitorRefresh] Failed to destroy bar window ${window.name}:`, error);
            }
        }
    }

    private _destroyNotificationWindow(windows: Gtk.Window[]): void {
        const notificationWindows = windows.filter((w) => w.name === 'notifications-window');
        for (const window of notificationWindows) {
            try {
                window?.destroy();
            } catch (error) {
                console.warn(`[MonitorRefresh] Failed to destroy notification window ${window.name}:`, error);
            }
        }
    }

    private _destroyOsdWindow(windows: Gtk.Window[]): void {
        const osdWindows = windows.filter((w) => w.name === 'indicator');
        for (const window of osdWindows) {
            try {
                window?.destroy();
            } catch (error) {
                console.warn(`[MonitorRefresh] Failed to destroy OSD window ${window.name}:`, error);
            }
        }
    }
}
