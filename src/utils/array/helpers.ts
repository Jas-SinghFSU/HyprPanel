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

/**
 * Chunks an array into smaller arrays of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns An array of chunked arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
