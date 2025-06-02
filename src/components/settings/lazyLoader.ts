import { App } from 'astal/gtk3';
import { Timer } from 'src/lib/performance/timer';

/**
 * Manages lazy loading of the settings dialog to improve startup performance.
 * The dialog is only created when first accessed, not during app initialization.
 */
export class SettingsDialogLoader {
    private static _instance: SettingsDialogLoader | null = null;
    private _settingsDialog: JSX.Element | null = null;
    private _loadPromise: Promise<JSX.Element> | null = null;

    private constructor() {}

    /**
     * Gets the singleton instance of the settings dialog loader
     */
    public static getInstance(): SettingsDialogLoader {
        if (!SettingsDialogLoader._instance) {
            SettingsDialogLoader._instance = new SettingsDialogLoader();
        }
        return SettingsDialogLoader._instance;
    }

    /**
     * Preloads the settings dialog
     */
    public static async preload(): Promise<void> {
        const instance = SettingsDialogLoader.getInstance();
        await instance._getDialog();
    }

    /**
     * Loads and returns the settings dialog, creating it if necessary.
     * Multiple concurrent calls will share the same loading promise.
     */
    private async _getDialog(): Promise<JSX.Element> {
        if (this._settingsDialog) {
            return this._settingsDialog;
        }

        if (this._loadPromise) {
            return this._loadPromise;
        }

        this._loadPromise = this._loadSettingsDialog();

        try {
            this._settingsDialog = await this._loadPromise;
            return this._settingsDialog;
        } finally {
            this._loadPromise = null;
        }
    }

    /**
     * Performs the actual loading of the settings dialog module
     */
    private async _loadSettingsDialog(): Promise<JSX.Element> {
        const { default: options } = await import('src/configuration');
        const isLazyLoading = options.hyprpanel.useLazyLoading.get();
        const timerLabel = isLazyLoading ? 'Lazy loading settings dialog' : 'Preloading settings dialog';
        const timer = new Timer(timerLabel);

        try {
            const { default: SettingsDialog } = await import('./index');
            const dialog = SettingsDialog();
            timer.end();
            return dialog;
        } catch (error) {
            timer.end();
            throw new Error(`Failed to load settings dialog: ${error}`);
        }
    }

    /**
     * Toggles the settings dialog visibility, loading it if necessary
     */
    public async toggle(): Promise<void> {
        await this._getDialog();
        App.toggle_window('settings-dialog');
    }
}

/**
 * Convenience function to toggle the settings dialog
 */
export async function toggleSettingsDialog(): Promise<void> {
    const loader = SettingsDialogLoader.getInstance();
    await loader.toggle();
}
