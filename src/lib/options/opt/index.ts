import Variable from 'astal/variable';
import { ConfigManager } from '../configManager';

/**
 * A managed application option with persistence capabilities
 */
export class Opt<T = unknown> extends Variable<T> {
    public readonly initial: T;
    public readonly persistent: boolean;
    private _id = '';
    private _configManager: ConfigManager;

    constructor(initial: T, configManager: ConfigManager, { persistent = false }: OptProps = {}) {
        super(initial);
        this.initial = initial;
        this.persistent = persistent;
        this._configManager = configManager;
    }

    public toJSON(): string {
        return `opt:${JSON.stringify(this.get())}`;
    }

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

    public init(config: Record<string, unknown>): void {
        const value = this._configManager.getNestedValue(config, this._id);

        if (value !== undefined) {
            this.set(value as T, { writeDisk: false });
        }
    }

    public set = (value: T, { writeDisk = true }: WriteOptions = {}): void => {
        if (value === this.get()) {
            return;
        }

        super.set(value);

        if (writeDisk) {
            this._configManager.updateOption(this._id, value);
        }
    };

    public reset(writeOptions: WriteOptions = {}): string | undefined {
        if (this.persistent) {
            return;
        }

        const hasChanged = this._hasChangedFromInitial();

        if (hasChanged) {
            this.set(this.initial, writeOptions);
            return this._id;
        }

        return;
    }

    private _hasChangedFromInitial(): boolean {
        let currentValue: string | T = this.get();
        currentValue = typeof currentValue === 'object' ? JSON.stringify(currentValue) : currentValue;

        let initialValue: string | T = this.initial;
        initialValue = typeof initialValue === 'object' ? JSON.stringify(initialValue) : initialValue;

        return currentValue !== initialValue;
    }
}

/**
 * Properties that can be passed when creating an option
 */
export interface OptProps {
    persistent?: boolean;
}

/**
 * Options for set operations
 */
interface WriteOptions {
    writeDisk?: boolean;
}
