import { MkOptionsResult } from './types/options.types';
import Variable from 'astal/variable';
import { monitorFile, readFile, writeFile } from 'astal/file';
import { errorHandler, Notify } from './utils';
import { ensureDirectory } from './session';
import icons from './icons/icons';

type OptProps = {
    persistent?: boolean;
};

type WriteDiskProps = {
    writeDisk?: boolean;
};

export class Opt<T = unknown> extends Variable<T> {
    /**
     * The initial value set when the `Opt` is created.
     */
    public readonly initial: T;

    /**
     * Indicates whether this option should remain unchanged even when reset operations occur.
     */
    public readonly persistent: boolean;

    private _id = '';

    /**
     * Creates an instance of `Opt`.
     *
     * @param {T} initial - The initial value of the option.
     * @param {OptProps} [props={}] - Additional properties for the option.
     */
    constructor(initial: T, { persistent = false }: OptProps = {}) {
        super(initial);
        this.initial = initial;
        this.persistent = persistent;
    }

    /**
     * Converts the current value to a JSON-compatible string.
     *
     * @returns {string}
     */
    public toJSON(): string {
        return `opt:${JSON.stringify(this.get())}`;
    }

    public get value(): T {
        return this.get();
    }

    /**
     * Setter for the current value of the option.
     */
    public set value(val: T) {
        this.set(val);
    }

    /**
     * Getter for the unique ID of the option.
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Setter for the unique ID of the option.
     */
    public set id(newId: string) {
        this._id = newId;
    }

    /**
     * Initializes this option based on the provided configuration, if available.
     *
     * @param config - The configuration.
     */
    public init(config: Record<string, unknown>): void {
        const value = _findVal(config, this._id.split('.'));

        if (value !== undefined) {
            this.set(value as T, { writeDisk: false });
        }
    }

    /**
     * Set the given configuration value and write it to disk, if specified.
     *
     * @param value - The new value.
     * @param writeDisk - Whether to write the changes to disk. Defaults to true.
     */
    public set = (value: T, { writeDisk = true }: WriteDiskProps = {}): void => {
        if (value === this.get()) {
            // If nothing actually changed, exit quick
            return;
        }

        super.set(value);

        if (writeDisk) {
            const raw = readFile(CONFIG_FILE);
            let config: Record<string, unknown> = {};
            if (raw && raw.trim() !== '') {
                try {
                    config = JSON.parse(raw) as Record<string, unknown>;
                } catch (error) {
                    // Last thing we want is to reset someones entire config
                    // so notify them instead
                    console.error(`Failed to load config file: ${error}`);
                    Notify({
                        summary: 'Failed to load config file',
                        body: `${error}`,
                        iconName: icons.ui.warning,
                    });

                    errorHandler(error);
                }
            }
            config[this._id] = value;
            writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
        }
    };

    /**
     * Resets the value of this option to its initial value if not persistent and if it differs from the current value.
     *
     * @param writeDisk - Whether to write the changes to disk. Defaults to true.
     * @returns Returns the option's ID if reset occurred, otherwise undefined.
     */
    public reset(writeDiskProps: WriteDiskProps = {}): string | undefined {
        if (this.persistent) {
            return undefined;
        }

        let currentValue: string | T = this.get();
        currentValue = typeof currentValue === 'object' ? JSON.stringify(currentValue) : currentValue;
        let initialValue: string | T = this.initial;
        initialValue = typeof initialValue === 'object' ? JSON.stringify(initialValue) : initialValue;

        if (currentValue !== initialValue) {
            this.set(this.initial, writeDiskProps);
            return this._id;
        }

        return undefined;
    }
}

/**
 * Recursively searches for a value in a nested object using a path array.
 *
 * @param obj - The object to search within
 * @param path - Array of property names representing the path to the desired value
 * @returns The value found at the specified path, or undefined if not found
 *
 * @example
 * // Returns "baz"
 * _findVal({ foo: { bar: "baz" } }, ["foo", "bar"]);
 *
 * @example
 * // Also works with dot notation in object keys
 * _findVal({ "foo.bar": "baz" }, ["foo", "bar"]);
 *
 * @private
 */
function _findVal(obj: Record<string, unknown>, path: string[]): unknown | undefined {
    const top = path.shift();

    if (top === undefined) {
        return obj;
    }

    if (typeof obj !== 'object') {
        return undefined;
    }

    const mergedPath = [top, ...path].join('.');

    if (mergedPath in obj) {
        return obj[mergedPath];
    }

    if (top in obj) {
        return _findVal(obj[top] as Record<string, unknown>, path);
    }

    return undefined;
}

/**
 * Creates an `Opt` instance with the given initial value and properties.
 * @template T
 * @param initial - The initial value.
 * @param [props] - Additional properties.
 */
export function opt<T>(initial: T, props?: OptProps): Opt<T> {
    return new Opt(initial, props);
}

/**
 * Recursively traverses the provided object to extract all `Opt` instances, assigning IDs to each.
 *
 * @param optionsObj - The object containing `Opt` instances.
 * @param [path=''] - The current path (used internally).
 * @param [arr=[]] - The accumulator array for found `Opt` instances.
 * @returns An array of all found `Opt` instances.
 */
function getOptions(optionsObj: Record<string, unknown>, path = '', arr: Opt[] = []): Opt[] {
    try {
        for (const key in optionsObj) {
            const value = optionsObj[key];
            const id = path ? `${path}.${key}` : key;

            if (value instanceof Variable) {
                const optValue = value as Opt;
                optValue.id = id;
                arr.push(optValue);
            } else if (typeof value === 'object' && value !== null) {
                getOptions(value as Record<string, unknown>, id, arr);
            }
        }
        return arr;
    } catch (error) {
        errorHandler(error);
    }
}

/**
 * Creates and initializes options from a given object structure. The returned object
 * includes methods to reset values, reset theme colors, and handle dependencies.
 *
 * @template T extends object
 * @param optionsObj - The object containing nested `Opt` instances.
 * @returns The original object extended with additional methods for handling options.
 */
export function mkOptions<T extends object>(optionsObj: T): T & MkOptionsResult {
    ensureDirectory(CONFIG_FILE.split('/').slice(0, -1).join('/'));

    const rawConfig = readFile(CONFIG_FILE);

    let config: Record<string, unknown> = {};
    if (rawConfig && rawConfig.trim() !== '') {
        try {
            config = JSON.parse(rawConfig) as Record<string, unknown>;
        } catch (error) {
            Notify({
                summary: 'Failed to load config file',
                body: `${error}`,
                iconName: icons.ui.warning,
            });
            // Continue with a broken config, the user has
            // been warned
        }
    }

    // Initialize the config options
    const allOptions = getOptions(optionsObj as Record<string, unknown>);
    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].init(config);
    }

    // Setup a file monitor to allow live config edit preview from outside
    // the config menu
    const debounceTimeMs = 200;
    let lastEventTime = Date.now();
    monitorFile(CONFIG_FILE, () => {
        if (Date.now() - lastEventTime < debounceTimeMs) {
            return;
        }
        lastEventTime = Date.now();

        let newConfig: Record<string, unknown> = {};

        const rawConfig = readFile(CONFIG_FILE);
        if (rawConfig && rawConfig.trim() !== '') {
            try {
                newConfig = JSON.parse(rawConfig) as Record<string, unknown>;
            } catch (error) {
                console.error(`Error loading configuration file: ${error}`);
                Notify({
                    summary: 'Loading configuration file failed',
                    body: `${error}`,
                    iconName: icons.ui.warning,
                });
                return;
            }
        }

        for (let i = 0; i < allOptions.length; i++) {
            const opt = allOptions[i];
            const newVal = _findVal(newConfig, opt.id.split('.'));

            if (newVal === undefined) {
                // Set the variable but don't write it back to the file,
                // as we are getting it from there
                opt.reset({ writeDisk: false });
                continue;
            }

            const oldVal = opt.get();
            if (newVal !== oldVal) {
                // Set the variable but don't write it back to the file,
                // as we are getting it from there
                opt.set(newVal, { writeDisk: false });
            }
        }
    });

    /**
     * A simple sleep utility.
     *
     * @param [ms=0] - Milliseconds to sleep.
     */
    function sleep(ms = 0): Promise<T> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Resets all options to their initial values if possible.
     *
     * @param opts - Array of all option instances.
     * @returns IDs of all reset options.
     */
    async function resetAll(opts: Opt[]): Promise<string[]> {
        const results: string[] = [];
        for (let i = 0; i < opts.length; i++) {
            const id = opts[i].reset();

            if (id !== undefined) {
                results.push(id);
                await sleep(50);
            }
        }
        return results;
    }

    return Object.assign(optionsObj, {
        array: (): Opt[] => allOptions,
        async reset(): Promise<string> {
            const ids = await resetAll(allOptions);

            return ids.join('\n');
        },

        /**
         * Registers a callback that fires when any option whose ID starts with any of the given dependencies changes.
         *
         * @param deps - An array of dependency prefixes.
         * @param callback - The callback function to execute on changes.
         */
        handler(deps: string[], callback: () => void): void {
            for (let i = 0; i < allOptions.length; i++) {
                const opt = allOptions[i];

                for (let j = 0; j < deps.length; j++) {
                    if (opt.id.startsWith(deps[j])) {
                        opt.subscribe(callback);
                        break;
                    }
                }
            }
        },
    });
}
