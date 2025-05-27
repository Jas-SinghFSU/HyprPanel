import { WindDirection } from '../types';

/**
 * Converts wind degrees to compass direction
 *
 * @param degrees - Wind direction in degrees (0-360)
 * @returns Compass direction
 */
export const windDegreesToDirection = (degrees: number): WindDirection => {
    const directions: WindDirection[] = [
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
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};

/**
 * Normalizes weather condition codes to string format
 *
 * @param providerCode - Code from weather provider (string or number)
 * @returns Normalized string code
 */
export const normalizeConditionCode = (providerCode: string | number): string => {
    return String(providerCode);
};
