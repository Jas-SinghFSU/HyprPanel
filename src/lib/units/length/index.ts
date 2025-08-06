import { LengthUnit } from './types';

export class LengthConverter {
    private readonly _value: number;
    private readonly _unit: LengthUnit;

    private static readonly _TO_METERS: Record<LengthUnit, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        mi: 1609.344,
    };

    private constructor(value: number, unit: LengthUnit) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Creates a converter from millimeters
     * @param value - Value in millimeters
     */
    public static fromMm(value: number): LengthConverter {
        return new LengthConverter(value, 'mm');
    }

    /**
     * Creates a converter from centimeters
     * @param value - Value in centimeters
     */
    public static fromCm(value: number): LengthConverter {
        return new LengthConverter(value, 'cm');
    }

    /**
     * Creates a converter from meters
     * @param value - Value in meters
     */
    public static fromMeters(value: number): LengthConverter {
        return new LengthConverter(value, 'm');
    }

    /**
     * Creates a converter from kilometers
     * @param value - Value in kilometers
     */
    public static fromKm(value: number): LengthConverter {
        return new LengthConverter(value, 'km');
    }

    /**
     * Creates a converter from inches
     * @param value - Value in inches
     */
    public static fromInches(value: number): LengthConverter {
        return new LengthConverter(value, 'in');
    }

    /**
     * Creates a converter from feet
     * @param value - Value in feet
     */
    public static fromFeet(value: number): LengthConverter {
        return new LengthConverter(value, 'ft');
    }

    /**
     * Creates a converter from miles
     * @param value - Value in miles
     */
    public static fromMiles(value: number): LengthConverter {
        return new LengthConverter(value, 'mi');
    }

    /**
     * Converts to meters (base unit)
     */
    private _toBaseUnit(): number {
        return this._value * LengthConverter._TO_METERS[this._unit];
    }

    /**
     * Converts from meters to target unit
     */
    private _fromBaseUnit(targetUnit: LengthUnit): number {
        return this._toBaseUnit() / LengthConverter._TO_METERS[targetUnit];
    }

    /**
     * Converts to millimeters
     */
    public toMm(): number {
        return this._fromBaseUnit('mm');
    }

    /**
     * Converts to centimeters
     */
    public toCm(): number {
        return this._fromBaseUnit('cm');
    }

    /**
     * Converts to meters
     */
    public toMeters(): number {
        return this._toBaseUnit();
    }

    /**
     * Converts to kilometers
     */
    public toKm(): number {
        return this._fromBaseUnit('km');
    }

    /**
     * Converts to inches
     */
    public toInches(): number {
        return this._fromBaseUnit('in');
    }

    /**
     * Converts to feet
     */
    public toFeet(): number {
        return this._fromBaseUnit('ft');
    }

    /**
     * Converts to miles
     */
    public toMiles(): number {
        return this._fromBaseUnit('mi');
    }

    /**
     * Formats to millimeters
     * @param precision - Number of decimal places
     */
    public formatMm(precision = 0): string {
        return `${this.toMm().toFixed(precision)} mm`;
    }

    /**
     * Formats to centimeters
     * @param precision - Number of decimal places
     */
    public formatCm(precision = 1): string {
        return `${this.toCm().toFixed(precision)} cm`;
    }

    /**
     * Formats to meters
     * @param precision - Number of decimal places
     */
    public formatMeters(precision = 2): string {
        return `${this.toMeters().toFixed(precision)} m`;
    }

    /**
     * Formats to kilometers
     * @param precision - Number of decimal places
     */
    public formatKm(precision = 1): string {
        return `${this.toKm().toFixed(precision)} km`;
    }

    /**
     * Formats to inches
     * @param precision - Number of decimal places
     */
    public formatInches(precision = 1): string {
        return `${this.toInches().toFixed(precision)} in`;
    }

    /**
     * Formats to feet
     * @param precision - Number of decimal places
     */
    public formatFeet(precision = 0): string {
        return `${this.toFeet().toFixed(precision)} ft`;
    }

    /**
     * Formats to miles
     * @param precision - Number of decimal places
     */
    public formatMiles(precision = 1): string {
        return `${this.toMiles().toFixed(precision)} mi`;
    }
}
