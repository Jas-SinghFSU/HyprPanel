import { errorHandler } from 'src/core/errors/handler';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { ServiceStatus } from 'src/core/system/types';
import { requiredDependencies } from './required';
import { optionalDependencies } from './optional';
import { Dependency } from './types';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const STATUS_INSTALLED = '(INSTALLED)';
const STATUS_ACTIVE = '(ACTIVE)';
const STATUS_DISABLED = '(DISABLED)';
const STATUS_MISSING = '(MISSING)';

/**
 * Checks all dependencies and returns a formatted output.
 *
 * @description Gathers the status of both required and optional dependencies and formats the result.
 */
export function checkDependencies(): string {
    try {
        let output = `${BOLD}Required Dependencies:${RESET}\n`;
        const dependencies = [...requiredDependencies, ...optionalDependencies];

        for (const dep of dependencies.filter((d) => d.required)) {
            output += getDependencyStatus(dep) + '\n';
        }

        output += `\n${BOLD}Optional Dependencies:${RESET}\n`;

        for (const dep of dependencies.filter((d) => !d.required)) {
            output += getDependencyStatus(dep) + '\n';
        }

        return output;
    } catch (error) {
        errorHandler(error);
    }
}

/**
 * Colors a given text using ANSI color codes.
 *
 * @description Wraps the provided text with ANSI color codes.
 *
 * @param text - The text to color.
 * @param color - The ANSI color code to use.
 */
function colorText(text: string, color: string): string {
    return `${color}${text}${RESET}`;
}

/**
 * Determines the status string and color for a dependency based on its type and checks.
 *
 * @description Returns the formatted line indicating the status of the given dependency.
 *
 * @param dep - The dependency to check.
 */
function getDependencyStatus(dep: Dependency): string {
    let status: ServiceStatus | 'INSTALLED' | 'MISSING';

    switch (dep.type) {
        case 'executable':
            status = SystemUtilities.checkExecutable(dep.check) ? 'INSTALLED' : 'MISSING';
            break;
        case 'library':
            status = SystemUtilities.checkLibrary(dep.check) ? 'INSTALLED' : 'MISSING';
            break;
        case 'service':
            status = SystemUtilities.checkServiceStatus(dep.check);
            break;
        default:
            status = 'MISSING';
    }

    let color: string;
    let textStatus: string;

    switch (status) {
        case 'ACTIVE':
            textStatus = STATUS_ACTIVE;
            color = GREEN;
            break;
        case 'INSTALLED':
            textStatus = STATUS_INSTALLED;
            color = GREEN;
            break;
        case 'DISABLED':
            textStatus = STATUS_DISABLED;
            color = YELLOW;
            break;
        case 'MISSING':
        default:
            textStatus = STATUS_MISSING;
            color = RED;
            break;
    }

    if (dep.description === undefined) {
        return `  ${colorText(textStatus, color)} ${dep.package}`;
    }

    return `  ${colorText(textStatus, color)} ${dep.package}: ${dep.description ?? ''}`;
}
