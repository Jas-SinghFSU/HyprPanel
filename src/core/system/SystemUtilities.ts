import AstalNotifd from 'gi://AstalNotifd';
import { NotificationArgs } from 'src/lib/types/notification.types';
import { exec, execAsync } from 'astal';
import icons from 'src/lib/icons/icons';
import { distroIcons } from 'src/lib/constants/distro';
import { distro } from 'src/lib/constants/system';

AstalNotifd.get_default();

export class SystemUtilities {
    /**
     * Sends a notification using the `notify-send` command.
     *
     * This function constructs a notification command based on the provided notification arguments and executes it asynchronously.
     * It logs an error if the notification fails to send.
     *
     * @param notifPayload The notification arguments containing summary, body, appName, iconName, urgency, timeout, category, transient, and id.
     */
    public static notify(notifPayload: NotificationArgs): void {
        SystemUtilities._notify(notifPayload);
    }

    /**
     * Checks if all specified dependencies are available
     * @param bins - The list of binaries to check
     * @returns True if all dependencies are found, false otherwise
     */
    public static checkDependencies(...bins: string[]): boolean {
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
            this._notify({
                summary: 'Dependencies not found!',
                body: `The following dependencies are missing: ${missing.join(', ')}`,
                iconName: icons.ui.warning,
            });
        }

        return missing.length === 0;
    }

    /**
     * Executes a bash command asynchronously
     * @param strings - The command to execute as a template string or a regular string
     * @param values - Additional values to interpolate into the command
     * @returns A promise that resolves to the command output as a string
     */
    public static async bash(strings: TemplateStringsArray | string, ...values: unknown[]): Promise<string> {
        const stringsIsString = typeof strings === 'string';

        const cmd = stringsIsString
            ? strings
            : strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

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
    public static async sh(cmd: string | string[]): Promise<string> {
        return execAsync(cmd).catch((err) => {
            console.error(typeof cmd === 'string' ? cmd : cmd.join(' '), err);
            return '';
        });
    }

    /**
     * Retrieves the icon for the current distribution
     * @returns The icon for the current distribution as a string
     */
    public static getDistroIcon(): string {
        const icon = distroIcons.find(([id]) => id === distro.id);
        return icon ? icon[1] : '';
    }

    private static _notify(notifPayload: NotificationArgs): void {
        let command = 'notify-send';

        command += ` "${notifPayload.summary} "`;

        if (notifPayload.body !== undefined) command += ` "${notifPayload.body}" `;
        if (notifPayload.appName !== undefined) command += ` -a "${notifPayload.appName}"`;
        if (notifPayload.iconName !== undefined) command += ` -i "${notifPayload.iconName}"`;
        if (notifPayload.urgency !== undefined) command += ` -u "${notifPayload.urgency}"`;
        if (notifPayload.timeout !== undefined) command += ` -t ${notifPayload.timeout}`;
        if (notifPayload.category !== undefined) command += ` -c "${notifPayload.category}"`;
        if (notifPayload.transient !== undefined) command += ' -e';
        if (notifPayload.id !== undefined) command += ` -r ${notifPayload.id}`;

        execAsync(command)
            .then()
            .catch((err) => {
                console.error(`Failed to send notification: ${err.message}`);
            });
    }
}
