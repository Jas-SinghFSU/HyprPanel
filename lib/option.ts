import { isHexColor } from 'globals/variables';
import { Variable } from 'resource:///com/github/Aylur/ags/variable.js';
import { MkOptionsResult } from './types/options';

type OptProps = {
    persistent?: boolean;
};

export class Opt<T = unknown> extends Variable<T> {
    static {
        Service.register(this);
    }

    constructor(initial: T, { persistent = false }: OptProps = {}) {
        super(initial);
        this.initial = initial;
        this.persistent = persistent;
    }

    initial: T;
    id = '';
    persistent: boolean;
    toString(): string {
        return `${this.value}`;
    }
    toJSON(): string {
        return `opt:${this.value}`;
    }

    getValue = (): T => {
        return super.getValue();
    };
    init(cacheFile: string): void {
        const cacheV = JSON.parse(Utils.readFile(cacheFile) || '{}')[this.id];
        if (cacheV !== undefined) this.value = cacheV;

        this.connect('changed', () => {
            const cache = JSON.parse(Utils.readFile(cacheFile) || '{}');
            cache[this.id] = this.value;
            Utils.writeFileSync(JSON.stringify(cache, null, 2), cacheFile);
        });
    }

    reset(): string | undefined {
        if (this.persistent) return;

        if (JSON.stringify(this.value) !== JSON.stringify(this.initial)) {
            this.value = this.initial;
            return this.id;
        }
    }

    doResetColor(): string | undefined {
        if (this.persistent) return;

        const isColor = isHexColor(this.value as string);
        if (JSON.stringify(this.value) !== JSON.stringify(this.initial) && isColor) {
            this.value = this.initial;
            return this.id;
        }
        return;
    }
}

export const opt = <T>(initial: T, opts?: OptProps): Opt<T> => new Opt(initial, opts);

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

    Utils.ensureDirectory(cacheFile.split('/').slice(0, -1).join('/'));

    const configFile = `${TMP}/${confFile}`;
    const values = getOptions(object as Record<string, unknown>).reduce(
        (obj, { id, value }) => ({ [id]: value, ...obj }),
        {},
    );
    Utils.writeFileSync(JSON.stringify(values, null, 2), configFile);
    Utils.monitorFile(configFile, () => {
        const cache = JSON.parse(Utils.readFile(configFile) || '{}');
        for (const opt of getOptions(object as Record<string, unknown>)) {
            if (JSON.stringify(cache[opt.id]) !== JSON.stringify(opt.value)) opt.value = cache[opt.id];
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
                if (deps.some((i) => opt.id.startsWith(i))) opt.connect('changed', callback);
            }
        },
    });
}
