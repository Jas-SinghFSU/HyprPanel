import { SpeedUnit } from './types';

export class SpeedConverter {
    private readonly _value: number;
    private readonly _unit: SpeedUnit;

    private static readonly _TO_MPS: Record<SpeedUnit, number> = {
        mps: 1,
        kph: 0.277778,
        mph: 0.44704,
        knots: 0.514444,
    };

    private static readonly _LABELS: Record<SpeedUnit, string> = {
        mps: 'm/s',
        kph: 'km/h',
        mph: 'mph',
        knots: 'kn',
    };

    private constructor(value: number, unit: SpeedUnit) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Creates a converter from meters per second
     * @param value - Value in m/s
     */
    public static fromMps(value: number): SpeedConverter {
        return new SpeedConverter(value, 'mps');
    }

    /**
     * Creates a converter from kilometers per hour
     * @param value - Value in km/h
     */
    public static fromKph(value: number): SpeedConverter {
        return new SpeedConverter(value, 'kph');
    }

    /**
     * Creates a converter from miles per hour
     * @param value - Value in mph
     */
    public static fromMph(value: number): SpeedConverter {
        return new SpeedConverter(value, 'mph');
    }

    /**
     * Creates a converter from knots
     * @param value - Value in knots
     */
    public static fromKnots(value: number): SpeedConverter {
        return new SpeedConverter(value, 'knots');
    }

    /**
     * Converts to m/s (base unit)
     */
    private _toBaseUnit(): number {
        return this._value * SpeedConverter._TO_MPS[this._unit];
    }

    /**
     * Converts from m/s to target unit
     */
    private _fromBaseUnit(targetUnit: SpeedUnit): number {
        return this._toBaseUnit() / SpeedConverter._TO_MPS[targetUnit];
    }

    /**
     * Converts to meters per second
     */
    public toMps(): number {
        return this._toBaseUnit();
    }

    /**
     * Converts to kilometers per hour
     */
    public toKph(): number {
        return this._fromBaseUnit('kph');
    }

    /**
     * Converts to miles per hour
     */
    public toMph(): number {
        return this._fromBaseUnit('mph');
    }

    /**
     * Converts to knots
     */
    public toKnots(): number {
        return this._fromBaseUnit('knots');
    }

    /**
     * Formats to meters per second
     * @param precision - Number of decimal places
     */
    public formatMps(precision = 1): string {
        return `${this.toMps().toFixed(precision)} ${SpeedConverter._LABELS.mps}`;
    }

    /**
     * Formats to kilometers per hour
     * @param precision - Number of decimal places
     */
    public formatKph(precision = 0): string {
        return `${this.toKph().toFixed(precision)} ${SpeedConverter._LABELS.kph}`;
    }

    /**
     * Formats to miles per hour
     * @param precision - Number of decimal places
     */
    public formatMph(precision = 0): string {
        return `${this.toMph().toFixed(precision)} ${SpeedConverter._LABELS.mph}`;
    }

    /**
     * Formats to knots
     * @param precision - Number of decimal places
     */
    public formatKnots(precision = 0): string {
        return `${this.toKnots().toFixed(precision)} ${SpeedConverter._LABELS.knots}`;
    }
}
