/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The input string with the first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to camelCase
 * @param str - The string to convert
 * @returns The camelCase version of the string
 */
export function toCamelCase(str: string): string {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Converts a string to kebab-case
 * @param str - The string to convert
 * @returns The kebab-case version of the string
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Converts a string to Title Case
 * @param str - The string to convert
 * @returns The Title Case version of the string
 */
export function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/(?:^|\s|-|_)\w/g, (match) => match.toUpperCase())
        .replace(/[-_]/g, ' ');
}

/**
 * Converts a string to snake_case
 * @param str - The string to convert
 * @returns The snake_case version of the string
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase();
}

/**
 * Converts a string to PascalCase
 * @param str - The string to convert
 * @returns The PascalCase version of the string
 */
export function toPascalCase(str: string): string {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^(.)/, (char) => char.toUpperCase());
}

/**
 * Converts a string to CONSTANT_CASE
 * @param str - The string to convert
 * @returns The CONSTANT_CASE version of the string
 */
export function toConstantCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toUpperCase();
}

/**
 * Converts a string to sentence case
 * @param str - The string to convert
 * @returns The sentence case version of the string
 */
export function toSentenceCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .replace(/^\w/, (char) => char.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
}
