import { exec, execAsync } from 'astal/process';
import icons from '../../lib/icons/icons';
import { sendNotification } from '../../utils/notifications/send';

/**
 * Process execution utilities
 */

/**
 * Executes a bash command asynchronously
 * @param strings - The command to execute as a template string or a regular string
 * @param values - Additional values to interpolate into the command
 * @returns A promise that resolves to the command output as a string
 */
export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]): Promise<string> {
    const stringsIsString = typeof strings === 'string';
    const cmd = stringsIsString ? strings : strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

    return execAsync(['bash', '-c', cmd]).catch((err) => {
        console.error(cmd, err);
        return '';
    });
}

/**
 * Executes a shell command asynchronously
 * @param cmd - The command to execute as a string or an array of strings
 * @returns A promise that resolves to the command output as a string
 */
export async function sh(cmd: string | string[]): Promise<string> {
    return execAsync(cmd).catch((err) => {
        console.error(typeof cmd === 'string' ? cmd : cmd.join(' '), err);
        return '';
    });
}

/**
 * Checks if all specified dependencies are available
 * @param bins - The list of binaries to check
 * @returns True if all dependencies are found, false otherwise
 */
export function dependencies(...bins: string[]): boolean {
    const missing = bins.filter((bin) => {
        try {
            exec(`which ${bin}`);
            return false;
        } catch (e) {
            console.error(e);
            return true;
        }
    });

    if (missing.length > 0) {
        console.warn(Error(`missing dependencies: ${missing.join(', ')}`));
        sendNotification({
            summary: 'Dependencies not found!',
            body: `The following dependencies are missing: ${missing.join(', ')}`,
            iconName: icons.ui.warning,
        });
    }

    return missing.length === 0;
}