import { readFile, writeFile, monitorFile } from 'astal/file';
import { ensureDirectory } from '../../session';
import icons from '../../icons/icons';
import { errorHandler, SystemUtilities } from 'src/core';

/**
 * Manages configuration file operations including reading, writing, and change monitoring
 *
 * The ConfigManager centralizes all configuration persistence operations and provides
 * utilities for working with nested configuration structures.
 */
export class ConfigManager {
    private _configPath: string;
    private _changeCallbacks: Array<() => void> = [];

    /**
     * Creates a new configuration manager for a specific config file
     *
     * @param configPath - Path to the configuration file to manage
     */
    constructor(configPath: string) {
        this._configPath = configPath;
        this._ensureConfigDirectory();
        this._setupConfigMonitor();
    }

    /**
     * Updates a single option in the configuration file
     *
     * @param id - Dot-notation path of the option to update
     * @param value - New value to store for the option
     */
    public updateOption(id: string, value: unknown): void {
        const config = this.readConfig();
        config[id] = value;
        this.writeConfig(config);
    }

    /**
     * Retrieves a value from a nested object using a path
     *
     * @param dataObject - The object to search within
     * @param path - Dot-notation path or array of path segments
     * @returns The value at the specified path or undefined if not found
     */
    public getNestedValue(dataObject: Record<string, unknown>, path: string | string[]): unknown {
        const pathArray = typeof path === 'string' ? path.split('.') : path;
        return this._findValueByPath(dataObject, pathArray);
    }

    /**
     * Reads the current configuration from disk
     *
     * @returns The parsed configuration object or an empty object if the file doesn't exist
     */
    public readConfig(): Record<string, unknown> {
        const raw = readFile(this._configPath);
        if (!raw || raw.trim() === '') {
            return {};
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            this._handleConfigError(error);
            return {};
        }
    }

    /**
     * Writes configuration to disk
     *
     * @param config - The configuration object to serialize and save
     */
    public writeConfig(config: Record<string, unknown>): void {
        writeFile(this._configPath, JSON.stringify(config, null, 2));
    }

    /**
     * Registers a callback to be called when the config file changes
     *
     * @param callback - Function to execute when config file changes are detected
     */
    public onConfigChanged(callback: () => void): void {
        this._changeCallbacks.push(callback);
    }

    /**
     * Recursively navigates an object to find a value at the specified path
     *
     * @param currentObject - The object currently being traversed
     * @param pathKeys - Remaining path segments to navigate
     * @returns The value at the path or undefined if not found
     */
    private _findValueByPath(currentObject: Record<string, unknown>, pathKeys: string[]): unknown {
        const currentKey = pathKeys.shift();
        if (currentKey === undefined) {
            return currentObject;
        }
        if (!this._isObject(currentObject)) {
            return;
        }
        const propertyPath = [currentKey, ...pathKeys].join('.');
        if (propertyPath in currentObject) {
            return currentObject[propertyPath];
        }
        if (!(currentKey in currentObject)) {
            return;
        }
        const currentKeyValue = currentObject[currentKey];
        if (!this._isObject(currentKeyValue)) {
            return;
        }
        return this._findValueByPath(currentKeyValue, pathKeys);
    }

    /**
     * Ensures the directory for the config file exists
     */
    private _ensureConfigDirectory(): void {
        ensureDirectory(this._configPath.split('/').slice(0, -1).join('/'));
    }

    /**
     * Sets up file monitoring to detect external changes to the config file
     */
    private _setupConfigMonitor(): void {
        const debounceTimeMs = 200;
        let lastEventTime = Date.now();
        monitorFile(this._configPath, () => {
            if (Date.now() - lastEventTime < debounceTimeMs) {
                return;
            }
            lastEventTime = Date.now();
            this._notifyConfigChanged();
        });
    }

    /**
     * Notifies all registered callbacks about config file changes
     */
    private _notifyConfigChanged(): void {
        this._changeCallbacks.forEach((callback) => callback());
    }

    /**
     * Handles configuration parsing errors with appropriate logging and notification
     *
     * @param error - The error that occurred during config parsing
     */
    private _handleConfigError(error: unknown): void {
        console.error(`Failed to load config file: ${error}`);
        SystemUtilities.notify({
            summary: 'Failed to load config file',
            body: `${error}`,
            iconName: icons.ui.warning,
        });

        errorHandler(error);
    }

    /**
     * Type guard that checks if a value is a non-null object
     *
     * @param value - The value to check
     * @returns True if the value is a non-null object
     */
    private _isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }
}
