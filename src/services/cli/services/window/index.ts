import { App } from 'astal/gtk3';

/**
 * Manages Astral's application windows, providing centralized control over visibility
 * and state management for all UI windows in the HyprPanel system
 */
export class WindowService {
    /**
     * Determines whether a given window is currently displayed to the user
     *
     * @param windowName - The name identifier of the window to check
     * @returns Whether the window is currently visible
     */
    public isWindowVisible(windowName: string): boolean {
        return this._isWindowVisible(windowName);
    }

    /**
     * Makes a window visible on screen, typically called when user interaction
     * requires displaying a menu or dialog
     *
     * @param windowName - The name identifier of the window to show
     */
    public showWindow(windowName: string): void {
        return this._showWindow(windowName);
    }

    /**
     * Removes a window from display while preserving its state for later
     * presentation, commonly used for menus that need to retain their data
     *
     * @param windowName - The name identifier of the window to hide
     */
    public hideWindow(windowName: string): void {
        return this._hideWindow(windowName);
    }

    /**
     * Swaps window visibility state based on current display status, useful for
     * toggle buttons or keyboard shortcuts that control window appearance
     *
     * @param windowName - The name identifier of the window to toggle
     */
    public toggleWindow(windowName: string): void {
        if (this._isWindowVisible(windowName)) {
            this._hideWindow(windowName);
        } else {
            this._showWindow(windowName);
        }
    }

    private _isWindowVisible(windowName: string): boolean {
        const appWindow = App.get_window(windowName);

        if (appWindow === undefined || appWindow === null) {
            throw new Error(`Window with name "${windowName}" not found.`);
        }

        return appWindow.visible;
    }

    private _showWindow(windowName: string): void {
        const window = App.get_window(windowName);
        if (!window) {
            throw new Error(`Window with name "${windowName}" not found.`);
        }
        window.show();
    }

    private _hideWindow(windowName: string): void {
        const window = App.get_window(windowName);
        if (!window) {
            throw new Error(`Window with name "${windowName}" not found.`);
        }
        window.hide();
    }
}

export const windowService = new WindowService();
