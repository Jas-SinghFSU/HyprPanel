import { readFile, writeFile, monitorFile, Gio } from 'astal/file';
import { ensureDirectory } from '../../session';
import icons from '../../icons/icons';
import { errorHandler } from 'src/core/errors/handler';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

/**
 * Manages configuration file operations including reading, writing, and change monitoring
 *
 * Flow:
 * 1. Constructor creates config directory and starts file monitoring
 * 2. File monitor watches for external changes and triggers callbacks
 * 3. When writing config, monitor is canceled and recreated after delay
 * 4. External changes are debounced to prevent rapid callbacks
 * 5. Callbacks notify all registered listeners when config changes
 * 6. getNestedValue allows accessing deeply nested config values with dot notation
 */
export class ConfigManager {
    private static readonly _DEBOUNCE_DELAY_MS = 200;
    private static readonly _MONITOR_RESTART_DELAY_MS = 300;

    private readonly _configPath: string;
    private readonly _changeCallbacks: Array<() => void> = [];
    private _fileMonitor: Gio.FileMonitor | null = null;
    private _lastChangeTime = 0;

    /**
     * Creates a new configuration manager for a specific config file
     *
     * @param configPath - Full path to the configuration JSON file
     */
    constructor(configPath: string) {
        this._configPath = configPath;
        this._createConfigDirectory();
        this._startConfigMonitoring();
    }

    /**
     * Updates a single option in the configuration file
     *
     * @param id - The option key to update
     * @param value - The new value to set
     */
    public updateOption(id: string, value: unknown): void {
        const config = this.readConfig();
        config[id] = value;
        this.writeConfig(config);
    }

    /**
     * Retrieves a value from a nested object using a path
     *
     * @param dataObject - The object to traverse
     * @param path - Dot-notation path (e.g., 'theme.colors.primary') or array of keys
     */
    public getNestedValue(dataObject: Record<string, unknown>, path: string | string[]): unknown {
        const pathSegments = Array.isArray(path) ? path : path.split('.');
        return this._navigateToValue(dataObject, pathSegments);
    }

    /**
     * Reads the current configuration from disk
     */
    public readConfig(): Record<string, unknown> {
        const fileContent = readFile(this._configPath);

        if (this._isEmptyOrMissing(fileContent)) {
            return {};
        }

        return this._parseConfigSafely(fileContent);
    }

    /**
     * Writes configuration to disk
     *
     * @param config - The configuration object to save
     */
    public writeConfig(config: Record<string, unknown>): void {
        writeFile(this._configPath, JSON.stringify(config, null, 2));
    }

    /**
     * Registers a callback to be called when the config file changes
     *
     * @param callback - Function to call when config changes
     */
    public onConfigChanged(callback: () => void): void {
        this._changeCallbacks.push(callback);
    }

    private _createConfigDirectory(): void {
        const directoryPath = this._getDirectoryPath();
        ensureDirectory(directoryPath);
    }

    /**
     * Extracts the directory path from the full config file path
     */
    private _getDirectoryPath(): string {
        return this._configPath.split('/').slice(0, -1).join('/');
    }

    /**
     * Sets up file monitoring to detect external changes to the config file
     */
    private _startConfigMonitoring(): void {
        this._createFileMonitor();
        this._overrideWriteConfigForMonitoring();
    }

    /**
     * Creates a new file monitor, canceling any existing one first
     *
     * We must recreate the monitor after writes because the file system
     * monitor can become invalid when the file is replaced during write operations
     */
    private _createFileMonitor(): void {
        this._cleanupExistingMonitor();

        this._fileMonitor = monitorFile(this._configPath, () => {
            this._handleFileChange();
        });
    }

    private _cleanupExistingMonitor(): void {
        if (!this._fileMonitor) return;

        try {
            this._fileMonitor.cancel();
        } catch (error) {
            console.debug('Error canceling file monitor:', error);
        }

        this._fileMonitor = null;
    }

    /**
     * Processes file change events with debouncing to prevent rapid updates
     */
    private _handleFileChange(): void {
        const now = Date.now();

        if (this._shouldIgnoreChange(now)) {
            return;
        }

        this._lastChangeTime = now;
        this._notifyAllCallbacks();
    }

    private _shouldIgnoreChange(currentTime: number): boolean {
        return currentTime - this._lastChangeTime < ConfigManager._DEBOUNCE_DELAY_MS;
    }

    /**
     * Wraps writeConfig to automatically restart the file monitor after writes
     *
     * This ensures we don't miss external changes that occur immediately after
     * our own writes, which would otherwise be lost when the monitor is invalidated
     */
    private _overrideWriteConfigForMonitoring(): void {
        const originalWriteConfig = this.writeConfig.bind(this);

        this.writeConfig = (config: Record<string, unknown>): void => {
            originalWriteConfig(config);
            this._restartMonitoringAfterWrite();
        };
    }

    /**
     * Schedules monitor recreation after a write operation
     *
     * The delay ensures the file system has finished processing the write
     * before we attach a new monitor, preventing race conditions
     */
    private _restartMonitoringAfterWrite(): void {
        setTimeout(() => {
            this._createFileMonitor();
        }, ConfigManager._MONITOR_RESTART_DELAY_MS);
    }

    private _isEmptyOrMissing(content: string): boolean {
        return !content || content.trim() === '';
    }

    private _parseConfigSafely(content: string): Record<string, unknown> {
        try {
            return JSON.parse(content);
        } catch (error) {
            this._handleParsingError(error);
            return {};
        }
    }

    /**
     * Recursively navigates an object to find a value at the specified path
     *
     * @param currentObject - The object to navigate
     * @param pathSegments - Array of keys representing the path
     */
    private _navigateToValue(currentObject: Record<string, unknown>, pathSegments: string[]): unknown {
        if (pathSegments.length === 0) {
            return currentObject;
        }

        if (!this._isValidObject(currentObject)) {
            return undefined;
        }

        const [currentKey, ...remainingPath] = pathSegments;
        const fullPath = [currentKey, ...remainingPath].join('.');

        if (fullPath in currentObject) {
            return currentObject[fullPath];
        }

        if (!(currentKey in currentObject)) {
            return undefined;
        }

        const nextValue = currentObject[currentKey];

        if (!this._isValidObject(nextValue)) {
            return undefined;
        }

        return this._navigateToValue(nextValue, remainingPath);
    }

    /**
     * Notifies all registered callbacks about config file changes
     */
    private _notifyAllCallbacks(): void {
        this._changeCallbacks.forEach((callback) => {
            try {
                callback();
            } catch (error) {
                console.error('Error in config change callback:', error);
            }
        });
    }

    /**
     * Handles configuration parsing errors with appropriate logging and notification
     *
     * @param error - The parsing error that occurred
     */
    private _handleParsingError(error: unknown): void {
        const errorMessage = `Failed to load config file: ${error}`;

        console.error(errorMessage);

        SystemUtilities.notify({
            summary: 'Configuration Error',
            body: errorMessage,
            iconName: icons.ui.warning,
        });

        errorHandler(error);
    }

    /**
     * Type guard that checks if a value is a valid object for navigation
     *
     * @param value - The value to check
     */
    private _isValidObject(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
}
