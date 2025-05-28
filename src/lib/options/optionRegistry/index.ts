import { Opt } from '../opt';
import { ConfigManager } from '../configManager';
import { MkOptionsResult, OptionsObject } from '../types';
import { errorHandler } from 'src/core/errors/handler';

/**
 * Creates and manages a registry of application options
 *
 * Provides functionality to collect, initialize, reset, and track options throughout
 * the application. Handles configuration synchronization and dependency-based subscriptions.
 */
export class OptionRegistry<T extends OptionsObject> {
    private _options: Opt[] = [];
    private _optionsObj: T;
    private _configManager: ConfigManager;

    /**
     * Creates a new option registry
     *
     * @param optionsObj - The object containing option definitions
     * @param configManager - The configuration manager to handle persistence
     */
    constructor(optionsObj: T, configManager: ConfigManager) {
        this._optionsObj = optionsObj;
        this._configManager = configManager;
        this._initializeOptions();
    }

    /**
     * Returns all registered options as an array
     */
    public toArray(): Opt[] {
        return this._options;
    }

    /**
     * Resets all options to their initial values
     *
     * @returns Newline-separated list of IDs for options that were reset
     */
    public async reset(): Promise<string> {
        const results = await this._resetAllOptions(this._options);
        return results.join('\n');
    }

    /**
     * Registers a callback for options matching the provided dependency prefixes
     *
     * @param optionsToWatch - Array of option ID prefixes to watch
     * @param callback - Function to call when matching options change
     */
    public handler(optionsToWatch: string[], callback: () => void): void {
        optionsToWatch.forEach((prefix) => {
            const matchingOptions = this._options.filter((opt) => opt.id.startsWith(prefix));

            matchingOptions.forEach((opt) => opt.subscribe(callback));
        });
    }

    /**
     * Updates options based on changes to the config file
     *
     * Synchronizes in-memory option values with the current state of the config file
     */
    public handleConfigFileChange(): void {
        const newConfig = this._configManager.readConfig();

        for (const opt of this._options) {
            const newVal = this._configManager.getNestedValue(newConfig, opt.id);

            if (newVal === undefined) {
                opt.reset({ writeDisk: false });
                continue;
            }

            const oldVal = opt.get();

            const newValueStringified = JSON.stringify(newVal, null, 2);
            const oldValueStringified = JSON.stringify(oldVal, null, 2);

            if (newValueStringified !== oldValueStringified) {
                opt.set(newVal, { writeDisk: false });
            }
        }
    }

    /**
     * Creates the enhanced options object with additional methods
     *
     * @returns The original options object enhanced with registry methods
     */
    public createEnhancedOptions(): T & MkOptionsResult {
        return Object.assign(this._optionsObj, {
            toArray: this.toArray.bind(this),
            reset: this.reset.bind(this),
            handler: this.handler.bind(this),
        });
    }

    /**
     * Initializes the option registry by collecting options and setting up monitoring
     */
    private _initializeOptions(): void {
        this._options = this._collectOptions(this._optionsObj);
        this._initializeFromConfig();

        this._configManager.onConfigChanged(() => {
            this.handleConfigFileChange();
        });
    }

    /**
     * Initializes option values from the saved configuration
     */
    private _initializeFromConfig(): void {
        const config = this._configManager.readConfig();

        for (const opt of this._options) {
            opt.init(config);
        }
    }

    /**
     * Recursively collects all option instances from an object structure
     *
     * @param sourceObject - The object to search for options
     * @param path - Current path in the object hierarchy
     * @returns Array of found option instances
     */
    private _collectOptions(sourceObject: Record<string, unknown>, path = ''): Opt[] {
        const result: Opt[] = [];

        try {
            for (const key in sourceObject) {
                const value = sourceObject[key];
                const id = path ? `${path}.${key}` : key;

                if (value instanceof Opt) {
                    value.id = id;
                    result.push(value);
                } else if (this._isNestedObject(value)) {
                    result.push(...this._collectOptions(value, id));
                }
            }
        } catch (error) {
            errorHandler(error);
        }

        return result;
    }

    /**
     * Resets all options to their initial values with a delay between operations
     *
     * @param opts - Array of options to reset
     * @returns Array of IDs for options that were reset
     */
    private async _resetAllOptions(opts: Opt[]): Promise<string[]> {
        const results: string[] = [];

        for (const opt of opts) {
            const id = opt.reset();

            if (id !== undefined) {
                results.push(id);
                await this._sleep(50);
            }
        }

        return results;
    }

    /**
     * Simple promise-based sleep function
     *
     * @param ms - Milliseconds to sleep
     */
    private _sleep(ms = 0): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Type guard to check if a value is a non-null object that can be traversed
     *
     * @param value - The value to check
     */
    private _isNestedObject(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }
}
