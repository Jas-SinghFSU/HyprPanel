import { PressureUnit } from './types';

export class PressureConverter {
    private readonly _value: number;
    private readonly _unit: PressureUnit;

    private static readonly _TO_PA: Record<PressureUnit, number> = {
        pa: 1,
        hpa: 100,
        mb: 100,
        inHg: 3386.39,
        psi: 6894.76,
    };

    private constructor(value: number, unit: PressureUnit) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Creates a converter from pascals
     * @param value - Value in pascals
     */
    public static fromPa(value: number): PressureConverter {
        return new PressureConverter(value, 'pa');
    }

    /**
     * Creates a converter from hectopascals
     * @param value - Value in hectopascals
     */
    public static fromHPa(value: number): PressureConverter {
        return new PressureConverter(value, 'hpa');
    }

    /**
     * Creates a converter from millibars
     * @param value - Value in millibars
     */
    public static fromMb(value: number): PressureConverter {
        return new PressureConverter(value, 'mb');
    }

    /**
     * Creates a converter from inches of mercury
     * @param value - Value in inches of mercury
     */
    public static fromInHg(value: number): PressureConverter {
        return new PressureConverter(value, 'inHg');
    }

    /**
     * Creates a converter from pounds per square inch
     * @param value - Value in PSI
     */
    public static fromPsi(value: number): PressureConverter {
        return new PressureConverter(value, 'psi');
    }

    /**
     * Converts to pascals (base unit)
     */
    private _toBaseUnit(): number {
        return this._value * PressureConverter._TO_PA[this._unit];
    }

    /**
     * Converts from pascals to target unit
     */
    private _fromBaseUnit(targetUnit: PressureUnit): number {
        return this._toBaseUnit() / PressureConverter._TO_PA[targetUnit];
    }

    /**
     * Converts to pascals
     */
    public toPa(): number {
        return this._toBaseUnit();
    }

    /**
     * Converts to hectopascals
     */
    public toHPa(): number {
        return this._fromBaseUnit('hpa');
    }

    /**
     * Converts to millibars
     */
    public toMb(): number {
        return this._fromBaseUnit('mb');
    }

    /**
     * Converts to inches of mercury
     */
    public toInHg(): number {
        return this._fromBaseUnit('inHg');
    }

    /**
     * Converts to pounds per square inch
     */
    public toPsi(): number {
        return this._fromBaseUnit('psi');
    }

    /**
     * Formats to pascals
     * @param precision - Number of decimal places
     */
    public formatPa(precision = 0): string {
        return `${this.toPa().toFixed(precision)} Pa`;
    }

    /**
     * Formats to hectopascals
     * @param precision - Number of decimal places
     */
    public formatHPa(precision = 0): string {
        return `${this.toHPa().toFixed(precision)} hPa`;
    }

    /**
     * Formats to millibars
     * @param precision - Number of decimal places
     */
    public formatMb(precision = 0): string {
        return `${this.toMb().toFixed(precision)} mb`;
    }

    /**
     * Formats to inches of mercury
     * @param precision - Number of decimal places
     */
    public formatInHg(precision = 2): string {
        return `${this.toInHg().toFixed(precision)} inHg`;
    }

    /**
     * Formats to pounds per square inch
     * @param precision - Number of decimal places
     */
    public formatPsi(precision = 1): string {
        return `${this.toPsi().toFixed(precision)} PSI`;
    }
}
