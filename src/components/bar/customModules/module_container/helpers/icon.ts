import { isPrimitive } from 'src/lib/validation/types';
import { CustomBarModuleIcon } from '../../types';
import { parseCommandOutputJson } from './utils';

const ERROR_ICON = '';

/**
 * Resolves the appropriate icon for a custom bar module based on its configuration and command output
 *
 * @param moduleName - The name of the module requesting the icon
 * @param commandOutput - The raw output string from the module's command execution
 * @param moduleIcon - The module's configuration metadata containing icon settings
 * @returns The resolved icon string based on the configuration, or ERROR_ICON if resolution fails
 *
 * @example
 * // Using a static icon
 * getIcon('myModule', '', { icon: '🚀' }) // returns '🚀'
 *
 * // Using an array of icons based on percentage
 * getIcon('myModule', '{"percentage": 50}', { icon: ['😡', '😐', '😊'] })
 *
 * // Using an object mapping for specific states
 * getIcon('myModule', '{"alt": "success"}', { icon: { success: '✅', error: '❌' } })
 */
export function getIcon(moduleName: string, commandOutput: string, moduleIcon: CustomBarModuleIcon): string {
    if (Array.isArray(moduleIcon)) {
        return getIconFromArray(moduleName, commandOutput, moduleIcon);
    }

    if (typeof moduleIcon === 'object') {
        return getIconFromObject(moduleName, commandOutput, moduleIcon);
    }

    return moduleIcon;
}

/**
 * Resolves an icon from an object configuration based on the 'alt' value in command output
 *
 * @param moduleName - The name of the module requesting the icon
 * @param commandOutput - The raw output string from the module's command execution
 * @param iconObject - Object mapping alternate text to corresponding icons
 * @returns The matched icon string or ERROR_ICON if resolution fails
 *
 * @throws Logs error and returns ERROR_ICON if:
 * - Command output cannot be parsed
 * - 'alt' value is not a string
 * - No matching icon is found for the alt text
 * - Corresponding icon value is not a string
 */
function getIconFromObject(
    moduleName: string,
    commandOutput: string,
    iconObject: Record<string, unknown>,
): string {
    try {
        const commandResults: CommandResults = parseCommandOutputJson(moduleName, commandOutput);

        if (!isPrimitive(commandResults?.alt) || commandResults?.alt === undefined) {
            console.error(`Expected 'alt' to be a primitive for module: ${moduleName}`);
            return ERROR_ICON;
        }

        const resultsAltText = String(commandResults?.alt);

        const correspondingAltIcon = iconObject[resultsAltText];

        if (correspondingAltIcon === undefined) {
            console.error(`Corresponding icon ${resultsAltText} not found for module: ${moduleName}`);
            return typeof iconObject.default === 'string' ? iconObject.default : ERROR_ICON;
        }

        if (typeof correspondingAltIcon !== 'string') {
            console.error(`Corresponding icon ${resultsAltText} is not a string for module: ${moduleName}`);
            return ERROR_ICON;
        }

        return correspondingAltIcon;
    } catch {
        return ERROR_ICON;
    }
}

/**
 * Resolves an icon from an array configuration based on the percentage value in command output
 *
 * @param moduleName - The name of the module requesting the icon
 * @param commandOutput - The raw output string from the module's command execution
 * @param iconArray - Array of icons to select from based on percentage ranges
 * @returns The appropriate icon string based on the percentage or ERROR_ICON if resolution fails
 *
 * @example
 * // With iconArray ['😡', '😐', '😊']
 * // 0-33%: returns '😡'
 * // 34-66%: returns '😐'
 * // 67-100%: returns '😊'
 *
 * @throws Logs error and returns ERROR_ICON if:
 * - Command output cannot be parsed
 * - Percentage value is not a number
 * - Percentage is NaN or exceeds 100
 */
function getIconFromArray(moduleName: string, commandOutput: string, iconArray: string[]): string {
    try {
        const commandResults: CommandResults = parseCommandOutputJson(moduleName, commandOutput);
        const resultsPercentage = commandResults?.percentage;

        if (typeof resultsPercentage !== 'number') {
            console.error(`Expected percentage to be a number for module: ${moduleName}`);
            return ERROR_ICON;
        }

        if (isNaN(resultsPercentage) || resultsPercentage > 100) {
            console.error(`Expected percentage to be between 1-100 for module: ${moduleName}`);
            return ERROR_ICON;
        }

        const step = 100 / iconArray.length;

        const iconForStep = iconArray.find((_, index) => resultsPercentage <= step * (index + 1));

        return iconForStep ?? ERROR_ICON;
    } catch {
        return ERROR_ICON;
    }
}

/**
 * Represents the expected structure of parsed command output
 */
type CommandResults = {
    /** Alternate text identifier for object-based icon configuration */
    alt?: string;
    /** Percentage value for array-based icon configuration (0-100) */
    percentage?: number;
};
