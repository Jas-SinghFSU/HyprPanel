import { Percentage, WindDirection } from '../types';

/**
 * Type guard to check if a value is a valid percentage
 *
 * @param value - Number to check
 * @returns True if value is between 0 and 100
 */
export const isValidPercentage = (value: number): value is Percentage => value >= 0 && value <= 100;

/**
 * Type guard to check if a string is a valid wind direction
 *
 * @param dir - String to check
 * @returns True if string is a valid WindDirection
 */
export const isValidWindDirection = (dir: string): dir is WindDirection =>
    [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
    ].includes(dir);
