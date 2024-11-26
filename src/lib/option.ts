import { isHexColor } from '../globals/variables';
import { MkOptionsResult } from './types/options';
import { ensureDirectory } from './session';
import Variable from 'astal/variable';
import Binding from 'astal/binding';
import { monitorFile, readFile, writeFile } from 'astal/file';

type OptProps = {
    persistent?: boolean;
};

export class Opt<T = unknown> extends Variable<T> {
    constructor(initial: T, { persistent = false }: OptProps = {}) {
        super(initial);
        this.initial = initial;
        this.persistent = persistent;
    }

    initial: T;
    private _id = '';
    persistent: boolean;
    toJSON(): string {
        return `opt:${this.get()}`;
    }

    getValue = (): T => {
        return this.get();
    };

    public get value(): T {
        return this.get();
    }

    public set value(val: T) {
        this.set(val);
    }

    public get id(): string {
        return this._id;
    }

    public set id(newId: string) {
        this._id = newId;
    }

    bind<R = T>(transform?: (value: T) => R): Binding<R> {
        const b = Binding.bind(this);
        return transform ? b.as(transform) : (b as unknown as Binding<R>);
    }

    init(cacheFile: string): void {
        const cacheV = JSON.parse(readFile(cacheFile) || '{}')[this._id];
        if (cacheV !== undefined) this.set(cacheV);

        this.subscribe((newVal) => {
            const cache = JSON.parse(readFile(cacheFile) || '{}');
            cache[this._id] = newVal;
            writeFile(cacheFile, JSON.stringify(cache, null, 2));
        });
    }

    reset(): string | undefined {
        if (this.persistent) return;

        if (JSON.stringify(this.get()) !== JSON.stringify(this.initial)) {
            this.set(this.initial);
            return this._id;
        }
    }

    doResetColor(): string | undefined {
        if (this.persistent) return;

        const isColor = isHexColor(this.get() as string);
        if (JSON.stringify(this.get()) !== JSON.stringify(this.initial) && isColor) {
            this.set(this.initial);
            return this._id;
        }
        return;
    }
}

export function opt<T>(initial: T, opts?: OptProps): Opt<T> {
    return new Opt(initial, opts);
}

const getOptions = (object: Record<string, unknown>, path = ''): Opt[] => {
    return Object.keys(object).flatMap((key) => {
        const obj = object[key];
        const id = path ? path + '.' + key : key;

        if (obj instanceof Variable) {
            const optValue = obj as Opt;
            optValue.id = id;
            return optValue;
        }

        if (typeof obj === 'object' && obj !== null) {
            return getOptions(obj as Record<string, unknown>, id); // Recursively process nested objects
        }

        return [];
    });
};

export function mkOptions<T extends object>(
    cacheFile: string,
    object: T,
    confFile: string = 'config.json',
): T & MkOptionsResult {
    for (const opt of getOptions(object as Record<string, unknown>)) opt.init(cacheFile);

    ensureDirectory(cacheFile.split('/').slice(0, -1).join('/'));

    const configFile = `${TMP}/${confFile}`;

    const values = getOptions(object as Record<string, unknown>).reduce(
        (obj, { id, value }) => ({ [id]: value, ...obj }),
        {},
    );

    writeFile(configFile, JSON.stringify(values, null, 2));

    monitorFile(configFile, () => {
        const cache = JSON.parse(readFile(configFile) || '{}');
        for (const opt of getOptions(object as Record<string, unknown>)) {
            if (JSON.stringify(cache[opt.id]) !== JSON.stringify(opt.get())) opt.set(cache[opt.id]);
        }
    });

    function sleep(ms = 0): Promise<T> {
        return new Promise((r) => setTimeout(r, ms));
    }

    const reset = async (
        [opt, ...list] = getOptions(object as Record<string, unknown>),
        id = opt?.reset(),
    ): Promise<Array<string>> => {
        if (!opt) return sleep().then(() => []);

        return id ? [id, ...(await sleep(50).then(() => reset(list)))] : await sleep().then(() => reset(list));
    };

    const resetTheme = async (
        [opt, ...list] = getOptions(object as Record<string, unknown>),
        id = opt?.doResetColor(),
    ): Promise<Array<string>> => {
        if (!opt) return sleep().then(() => []);

        return id
            ? [id, ...(await sleep(50).then(() => resetTheme(list)))]
            : await sleep().then(() => resetTheme(list));
    };

    return Object.assign(object, {
        configFile,
        array: () => getOptions(object as Record<string, unknown>),
        async reset() {
            return (await reset()).join('\n');
        },
        async resetTheme() {
            return (await resetTheme()).join('\n');
        },
        handler(deps: string[], callback: () => void) {
            for (const opt of getOptions(object as Record<string, unknown>)) {
                if (deps.some((i) => opt.id.startsWith(i))) opt.subscribe(callback);
            }
        },
    });
}
