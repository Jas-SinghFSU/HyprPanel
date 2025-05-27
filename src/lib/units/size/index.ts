import { SizeUnit } from './types';

export class SizeConverter {
    private readonly _value: number;
    private readonly _unit: SizeUnit;

    private constructor(value: number, unit: SizeUnit) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Creates a converter from bytes
     * @param value - Size in bytes
     */
    public static fromBytes(value: number): SizeConverter {
        return new SizeConverter(value, 'bytes');
    }

    /**
     * Creates a converter from kibibytes
     * @param value - Size in KiB
     */
    public static fromKiB(value: number): SizeConverter {
        return new SizeConverter(value, 'kibibytes');
    }

    /**
     * Creates a converter from mebibytes
     * @param value - Size in MiB
     */
    public static fromMiB(value: number): SizeConverter {
        return new SizeConverter(value, 'mebibytes');
    }

    /**
     * Creates a converter from gibibytes
     * @param value - Size in GiB
     */
    public static fromGiB(value: number): SizeConverter {
        return new SizeConverter(value, 'gibibytes');
    }

    /**
     * Creates a converter from tebibytes
     * @param value - Size in TiB
     */
    public static fromTiB(value: number): SizeConverter {
        return new SizeConverter(value, 'tebibytes');
    }

    /**
     * Converts the size to bytes (base unit)
     */
    private _toBaseUnit(): number {
        switch (this._unit) {
            case 'bytes':
                return this._value;
            case 'kibibytes':
                return this._value * 1024;
            case 'mebibytes':
                return this._value * 1024 ** 2;
            case 'gibibytes':
                return this._value * 1024 ** 3;
            case 'tebibytes':
                return this._value * 1024 ** 4;
        }
    }

    /**
     * Converts to bytes
     * @param precision - Number of decimal places (optional)
     */
    public toBytes(precision?: number): number {
        const value = this._toBaseUnit();
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to kibibytes
     * @param precision - Number of decimal places (optional)
     */
    public toKiB(precision?: number): number {
        const bytes = this._toBaseUnit();
        const value = bytes / 1024;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to mebibytes
     * @param precision - Number of decimal places (optional)
     */
    public toMiB(precision?: number): number {
        const bytes = this._toBaseUnit();
        const value = bytes / 1024 ** 2;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to gibibytes
     * @param precision - Number of decimal places (optional)
     */
    public toGiB(precision?: number): number {
        const bytes = this._toBaseUnit();
        const value = bytes / 1024 ** 3;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to tebibytes
     * @param precision - Number of decimal places (optional)
     */
    public toTiB(precision?: number): number {
        const bytes = this._toBaseUnit();
        const value = bytes / 1024 ** 4;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Automatically converts to the most appropriate unit
     * @param precision - Number of decimal places (optional)
     */
    public toAuto(precision?: number): { value: number; unit: SizeUnit } {
        const bytes = this._toBaseUnit();

        if (bytes >= 1024 ** 4) {
            return { value: this.toTiB(precision), unit: 'tebibytes' };
        }
        if (bytes >= 1024 ** 3) {
            return { value: this.toGiB(precision), unit: 'gibibytes' };
        }
        if (bytes >= 1024 ** 2) {
            return { value: this.toMiB(precision), unit: 'mebibytes' };
        }
        if (bytes >= 1024) {
            return { value: this.toKiB(precision), unit: 'kibibytes' };
        }

        return { value: this.toBytes(precision), unit: 'bytes' };
    }

    /**
     * Formats the size with a specific unit and precision
     * @param unit - Target unit
     * @param precision - Number of decimal places (default: 2)
     */
    public format(unit: SizeUnit, precision = 2): string {
        let value: number;
        let symbol: string;

        switch (unit) {
            case 'bytes':
                value = this.toBytes();
                symbol = 'B';
                break;
            case 'kibibytes':
                value = this.toKiB();
                symbol = 'KiB';
                break;
            case 'mebibytes':
                value = this.toMiB();
                symbol = 'MiB';
                break;
            case 'gibibytes':
                value = this.toGiB();
                symbol = 'GiB';
                break;
            case 'tebibytes':
                value = this.toTiB();
                symbol = 'TiB';
                break;
        }

        return `${value.toFixed(precision)} ${symbol}`;
    }

    /**
     * Formats to bytes
     * @param precision - Number of decimal places
     */
    public formatBytes(precision = 0): string {
        return this.format('bytes', precision);
    }

    /**
     * Formats to kibibytes
     * @param precision - Number of decimal places
     */
    public formatKiB(precision = 2): string {
        return this.format('kibibytes', precision);
    }

    /**
     * Formats to mebibytes
     * @param precision - Number of decimal places
     */
    public formatMiB(precision = 2): string {
        return this.format('mebibytes', precision);
    }

    /**
     * Formats to gibibytes
     * @param precision - Number of decimal places
     */
    public formatGiB(precision = 2): string {
        return this.format('gibibytes', precision);
    }

    /**
     * Formats to tebibytes
     * @param precision - Number of decimal places
     */
    public formatTiB(precision = 2): string {
        return this.format('tebibytes', precision);
    }

    /**
     * Automatically formats to the most appropriate unit
     * @param precision - Number of decimal places
     */
    public formatAuto(precision = 2): string {
        const { unit } = this.toAuto();
        return this.format(unit, precision);
    }
}
