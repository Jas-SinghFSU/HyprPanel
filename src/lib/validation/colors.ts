import { namedColors } from './colorNames';
import { HexColor } from '../options/types';

/**
 * Validates if a string is a valid GJS color
 * Supports named colors, hex colors, RGB, and RGBA formats
 * @param color - The color string to validate
 * @returns True if the color is valid, false otherwise
 */
export function isValidGjsColor(color: string): boolean {
    const colorLower = color.toLowerCase().trim();

    if (namedColors.has(colorLower)) {
        return true;
    }

    const hexColorRegex = /^#(?:[a-fA-F0-9]{3,4}|[a-fA-F0-9]{6,8})$/;
    const rgbRegex = /^rgb\(\s*(\d{1,3}%?\s*,\s*){2}\d{1,3}%?\s*\)$/;
    const rgbaRegex = /^rgba\(\s*(\d{1,3}%?\s*,\s*){3}(0|1|0?\.\d+)\s*\)$/;

    if (hexColorRegex.test(color)) {
        return true;
    }

    if (rgbRegex.test(colorLower) || rgbaRegex.test(colorLower)) {
        return true;
    }

    return false;
}

export const isHexColor = (val: unknown): val is HexColor => {
    return typeof val === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);
};
