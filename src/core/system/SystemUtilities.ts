import AstalNotifd from 'gi://AstalNotifd';
import { exec, execAsync, GLib } from 'astal';
import icons from 'src/lib/icons/icons';
import { distroIcons } from 'src/core/system/distroIcons';
import { distro } from 'src/core/system/osInfo';
import { CommandResult, NotificationArgs, ServiceStatus } from './types';

AstalNotifd.get_default();

export class SystemUtilities {
    /*******************************************
     *                 Notify                  *
     *******************************************/
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

    /*******************************************
     *           Depndency Checking            *
     *******************************************/

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
                console.debug(e);
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
     * Checks if any of the given executables is installed by using `which`.
     *
     * @description Iterates through a list of executables and returns true if any are found.
     *
     * @param executables - The list of executables to check.
     */
    public static checkExecutable(executables: string[]): boolean {
        for (const exe of executables) {
            const { exitCode } = this._runCommand(`which ${exe}`);

            if (exitCode === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if any of the given libraries is installed using `pkg-config`.
     *
     * @description Uses `pkg-config --exists <lib>` to determine if a library is installed.
     *
     * @param libraries - The list of libraries to check.
     */
    public static checkLibrary(libraries: string[]): boolean {
        for (const lib of libraries) {
            const { exitCode, stdout } = this._runCommand(`sh -c "ldconfig -p | grep ${lib}"`);

            if (exitCode === 0 && stdout.length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks the status of a service.
     *
     * @description Determines if a service is ACTIVE, INSTALLED (but not running), DISABLED, or MISSING.
     *
     * @param services - The list of services to check.
     */
    public static checkServiceStatus(services: string[]): ServiceStatus {
        for (const svc of services) {
            const activeResult = SystemUtilities.runCommand(`systemctl is-active ${svc}`);
            const activeStatus = activeResult.stdout;

            if (activeStatus === 'active') {
                return 'ACTIVE';
            }

            if (activeStatus === 'inactive' || activeStatus === 'failed') {
                const enabledResult = SystemUtilities.runCommand(`systemctl is-enabled ${svc}`);
                const enabledStatus = enabledResult.stdout;

                if (
                    enabledResult !== undefined &&
                    (enabledStatus === 'enabled' || enabledStatus === 'static')
                ) {
                    return 'INSTALLED';
                } else if (enabledResult !== undefined && enabledStatus === 'disabled') {
                    return 'DISABLED';
                } else {
                    return 'MISSING';
                }
            }

            if (activeStatus === 'unknown' || activeResult.exitCode !== 0) {
                continue;
            }
        }

        return 'MISSING';
    }

    /*******************************************
     *            Command Execution            *
     *******************************************/

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

    /*******************************************
     *               System Info               *
     *******************************************/

    /**
     * Retrieves the icon for the current distribution
     * @returns The icon for the current distribution as a string
     */
    public static getDistroIcon(): string {
        const icon = distroIcons.find(([id]) => id === distro.id);
        return icon ? icon[1] : '';
    }

    /**
     * Spawns a command line synchronously and returns the exit code and output.
     *
     * @description Executes a shell command using GLib.spawn_command_line_sync and extracts the exit code, stdout, and stderr.
     *
     * @param command - The command to execute.
     */
    public static runCommand(command: string): CommandResult {
        return this._runCommand(command);
    }

    private static _runCommand(command: string): CommandResult {
        const decoder = new TextDecoder();
        const decodeOutput = (output: Uint8Array): string => decoder.decode(output).trim();

        const [, out, err, exitCode] = GLib.spawn_command_line_sync(command);
        const stdout = out ? decodeOutput(out) : '';
        const stderr = err ? decodeOutput(err) : '';
        return {
            exitCode,
            stdout,
            stderr,
        };
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

        execAsync(command).catch((err) => {
            console.error(`Failed to send notification: ${err.message}`);
        });
    }
}
