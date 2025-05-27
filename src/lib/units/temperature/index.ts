import { TemperatureUnit } from './types';

export class TemperatureConverter {
    private readonly _value: number;
    private readonly _unit: TemperatureUnit;

    private constructor(value: number, unit: TemperatureUnit) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Creates a converter from Celsius
     * @param value - Temperature in Celsius
     */
    public static fromCelsius(value: number): TemperatureConverter {
        return new TemperatureConverter(value, 'celsius');
    }

    /**
     * Creates a converter from Fahrenheit
     * @param value - Temperature in Fahrenheit
     */
    public static fromFahrenheit(value: number): TemperatureConverter {
        return new TemperatureConverter(value, 'fahrenheit');
    }

    /**
     * Creates a converter from Kelvin
     * @param value - Temperature in Kelvin
     */
    public static fromKelvin(value: number): TemperatureConverter {
        return new TemperatureConverter(value, 'kelvin');
    }

    /**
     * Converts the temperature to Celsius (base unit)
     */
    private _toBaseUnit(): number {
        switch (this._unit) {
            case 'celsius':
                return this._value;
            case 'fahrenheit':
                return ((this._value - 32) * 5) / 9;
            case 'kelvin':
                return this._value - 273.15;
        }
    }

    /**
     * Converts to Celsius
     * @param precision - Number of decimal places (optional)
     */
    public toCelsius(precision?: number): number {
        const value = this._toBaseUnit();
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to Fahrenheit
     * @param precision - Number of decimal places (optional)
     */
    public toFahrenheit(precision?: number): number {
        const celsius = this._toBaseUnit();
        const value = (celsius * 9) / 5 + 32;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Converts to Kelvin
     * @param precision - Number of decimal places (optional)
     */
    public toKelvin(precision?: number): number {
        const celsius = this._toBaseUnit();
        const value = celsius + 273.15;
        return precision !== undefined ? Number(value.toFixed(precision)) : value;
    }

    /**
     * Formats the temperature with a specific unit and precision
     * @param unit - Target unit
     * @param precision - Number of decimal places (default: 0)
     */
    public format(unit: TemperatureUnit, precision = 0): string {
        let value: number;
        let symbol: string;

        switch (unit) {
            case 'celsius':
                value = this.toCelsius();
                symbol = '° C';
                break;
            case 'fahrenheit':
                value = this.toFahrenheit();
                symbol = '° F';
                break;
            case 'kelvin':
                value = this.toKelvin();
                symbol = ' K';
                break;
        }

        return `${value.toFixed(precision)}${symbol}`;
    }

    /**
     * Formats to Celsius
     * @param precision - Number of decimal places
     */
    public formatCelsius(precision = 0): string {
        return this.format('celsius', precision);
    }

    /**
     * Formats to Fahrenheit
     * @param precision - Number of decimal places
     */
    public formatFahrenheit(precision = 0): string {
        return this.format('fahrenheit', precision);
    }

    /**
     * Formats to Kelvin
     * @param precision - Number of decimal places
     */
    public formatKelvin(precision = 0): string {
        return this.format('kelvin', precision);
    }
}
