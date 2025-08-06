import { isPrimitive } from 'src/lib/validation/types';

/**
 * Generates a label based on module command output and a template configuration.
 *
 * @param moduleName - The name of the module (used for error reporting)
 * @param commandOutput - The raw output from a module command, expected to be a JSON string or plain text
 * @param labelConfig - A template string containing variables in the format {path.to.value}
 * @returns A formatted label with template variables replaced with actual values
 *
 * @example
 * // For a JSON command output: {"user": {"name": "Jim Halpert"}}
 * // And labelConfig: "Hello, {user.name}!"
 * // Returns: "Hello, Jim Halpert!"
 */
export function getLabel(moduleName: string, commandOutput: string, labelConfig: string): string {
    const processedCommandOutput = tryParseJson(moduleName, commandOutput);
    const regexForTemplateVariables = /\{([^{}]*)\}/g;

    return labelConfig.replace(regexForTemplateVariables, (_, path) => {
        return getValueForTemplateVariable(path, processedCommandOutput);
    });
}

/**
 * Extracts a value from command output based on a template variable path.
 *
 * @param templatePath - The dot-notation path to extract (e.g., "user.name")
 * @param commandOutput - The processed command output (either a string or object)
 * @returns The extracted value as a string, or empty string if not found
 */
function getValueForTemplateVariable(
    templatePath: string,
    commandOutput: string | Record<string, unknown>,
): string {
    if (typeof commandOutput === 'string') {
        return getTemplateValueForStringOutput(templatePath, commandOutput);
    }

    if (typeof commandOutput === 'object' && commandOutput !== null) {
        return getTemplateValueForObjectOutput(templatePath, commandOutput);
    }

    return '';
}

/**
 * Extracts a template value from string command output.
 *
 * @param templatePath - The path to extract value from
 * @param commandOutput - The string command output
 * @returns The entire string if path is empty, otherwise empty string
 */
function getTemplateValueForStringOutput(templatePath: string, commandOutput: string): string {
    if (templatePath === '') {
        return commandOutput;
    }
    return '';
}

/**
 * Extracts a template value from object command output using dot notation.
 *
 * @param templatePath - The dot-notation path to extract (e.g., "user.name")
 * @param commandOutput - The object representing parsed command output
 * @returns The extracted value as a string, or empty string if path is invalid or value is not primitive
 */
function getTemplateValueForObjectOutput(
    templatePath: string,
    commandOutput: Record<string, unknown>,
): string {
    const pathParts = templatePath.split('.');

    function isRecord(value: unknown): value is Record<string, unknown> {
        return value !== null && !Array.isArray(value) && typeof value === 'object';
    }

    try {
        const result = pathParts.reduce<unknown>((acc, part) => {
            if (!isRecord(acc)) {
                throw new Error('Path unreachable');
            }

            return acc[part];
        }, commandOutput);

        return isPrimitive(result) && result !== undefined ? String(result) : '';
    } catch {
        return '';
    }
}

/**
 * Attempts to parse a JSON string, with fallback to the original string.
 *
 * @param moduleName - The name of the module (used for error reporting)
 * @param commandOutput - The raw string output to parse as JSON
 * @returns A parsed object if valid JSON and an object, otherwise the original string
 */
function tryParseJson(moduleName: string, commandOutput: string): string | Record<string, unknown> {
    try {
        if (typeof commandOutput !== 'string') {
            console.error(
                `Expected command output to be a string but found ${typeof commandOutput} for module: ${moduleName}`,
            );
            return '';
        }

        const parsedCommand = JSON.parse(commandOutput);

        if (typeof parsedCommand === 'object' && parsedCommand !== null && !Array.isArray(parsedCommand)) {
            return parsedCommand as Record<string, unknown>;
        }

        return commandOutput;
    } catch {
        return commandOutput;
    }
}
