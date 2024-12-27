import { isHexColor } from '../globals/variables';
import { MkOptionsResult } from './types/options';
import { ensureDirectory } from './session';
import Variable from 'astal/variable';
import { monitorFile, readFile, writeFile } from 'astal/file';
import GLib from 'gi://GLib?version=2.0';
import { errorHandler } from './utils';

type OptProps = {
    persistent?: boolean;
};

/**
 * A file to store default configurations. Placed inside the cache directory.
 * NOTE: We need to move this out into the .config directory instead.
 */
export const defaultFile = `${GLib.get_tmp_dir()}/ags/hyprpanel/default.json`;

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
    toJSON(): string {
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
     * Initializes this option by attempting to read its value from a cache file.
     * If found, sets the current value. Also sets up a subscription to write updates back.
     *
     * @param cacheFile - The path to the cache file.
     */
    public init(cacheFile: string): void {
        const rawData = readFile(cacheFile);

        let cacheData: Record<string, unknown> = {};

        if (rawData && rawData.trim() !== '') {
            try {
                cacheData = JSON.parse(rawData) as Record<string, unknown>;
            } catch (error) {
                errorHandler(error);
            }
        }

        const cachedVariable = cacheData[this._id];

        if (cachedVariable !== undefined) {
            this.set(cachedVariable as T);
        }

        this.subscribe((newVal) => {
            const reRaw = readFile(cacheFile);
            let currentCache: Record<string, unknown> = {};
            if (reRaw && reRaw.trim() !== '') {
                try {
                    currentCache = JSON.parse(reRaw) as Record<string, unknown>;
                } catch {
                    // Do nuffin
                }
            }
            currentCache[this._id] = newVal;
            writeFile(cacheFile, JSON.stringify(currentCache, null, 2));
        });
    }

    /**
     * Initializes this option by attempting to read its default value from the default file.
     * If found, sets the current value.
     */
    public createDefault(): void {
        const rawData = readFile(defaultFile);

        let defaultData: Record<string, unknown> = {};

        if (rawData && rawData.trim() !== '') {
            try {
                defaultData = JSON.parse(rawData) as Record<string, unknown>;
            } catch {
                // do nuffin
            }
        }

        const defaultVal = defaultData[this._id];

        if (defaultVal !== undefined) {
            this.set(defaultVal as T);
        }
    }

    /**
     * Resets the value of this option to its initial value if not persistent and if it differs from the current value.
     *
     * @returns Returns the option's ID if reset occurred, otherwise undefined.
     */
    public reset(): string | undefined {
        if (this.persistent) {
            return undefined;
        }

        const current = this.get();

        if (JSON.stringify(current) !== JSON.stringify(this.initial)) {
            this.set(this.initial);
            return this._id;
        }

        return undefined;
    }
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
 * @param object - The object containing `Opt` instances.
 * @param [path=''] - The current path (used internally).
 * @param [arr=[]] - The accumulator array for found `Opt` instances.
 * @returns An array of all found `Opt` instances.
 */
function getOptions(object: Record<string, unknown>, path = '', arr: Opt[] = []): Opt[] {
    try {
        for (const key in object) {
            const value = object[key];
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
 * @param cacheFile - The file path to store cached values.
 * @param object - The object containing nested `Opt` instances.
 * @param [confFile='config.json'] - The configuration file name stored in TMP.
 * @returns The original object extended with additional methods for handling options.
 */
export function mkOptions<T extends object>(
    cacheFile: string,
    object: T,
    confFile: string = 'config.json',
): T & MkOptionsResult {
    const allOptions = getOptions(object as Record<string, unknown>);

    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].init(cacheFile);
    }

    ensureDirectory(cacheFile.split('/').slice(0, -1).join('/'));
    ensureDirectory(defaultFile.split('/').slice(0, -1).join('/'));

    const configFile = `${TMP}/${confFile}`;

    const values: Record<string, unknown> = {};
    const defaultValues: Record<string, unknown> = {};

    for (let i = 0; i < allOptions.length; i++) {
        const option = allOptions[i];
        const val = option.value;

        values[option.id] = val;

        if (isHexColor(val as string)) {
            defaultValues[option.id] = option.initial;
        } else {
            defaultValues[option.id] = val;
        }
    }

    writeFile(defaultFile, JSON.stringify(defaultValues, null, 2));
    writeFile(configFile, JSON.stringify(values, null, 2));

    monitorFile(configFile, () => {
        const raw = readFile(configFile);

        if (!raw || raw.trim() === '') return;

        let cache: Record<string, unknown>;

        try {
            cache = JSON.parse(raw) as Record<string, unknown>;
        } catch {
            return;
        }

        for (let i = 0; i < allOptions.length; i++) {
            const opt = allOptions[i];
            const newVal = cache[opt.id];
            const oldVal = opt.get();

            if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                opt.set(newVal as T);
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

            if (id) {
                results.push(id);
                await sleep(50);
            }
        }
        return results;
    }

    return Object.assign(object, {
        configFile,
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
