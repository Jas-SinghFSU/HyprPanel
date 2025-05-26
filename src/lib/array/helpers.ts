/**
 * Generates an array of numbers within a specified range
 * @param length - The length of the array to generate
 * @param start - The starting value of the range. Defaults to 1
 * @returns An array of numbers within the specified range
 */
export function range(length: number, start = 1): number[] {
    return Array.from({ length }, (_, i) => i + start);
}

/**
 * Removes duplicate values from an array
 * @param array - The array to deduplicate
 * @returns A new array with unique values
 */
export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
}
