export type Primitive = string | number | boolean | symbol | null | undefined | bigint;

/**
 * Checks if a value is a primitive type
 * @param value - The value to check
 * @returns True if the value is a primitive (null, undefined, string, number, boolean, symbol, or bigint)
 */
export function isPrimitive(value: unknown): value is Primitive {
    return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
