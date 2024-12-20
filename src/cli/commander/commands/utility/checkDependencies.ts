import { GLib } from 'astal';
import { errorHandler } from 'src/lib/utils';

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
 * Decodes a Uint8Array output into a trimmed UTF-8 string.
 *
 * @description Converts a Uint8Array output from a command execution into a human-readable string.
 *
 * @param output - The Uint8Array output to decode.
 */
function decodeOutput(output: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(output).trim();
}

/**
 * Spawns a command line synchronously and returns the exit code and output.
 *
 * @description Executes a shell command using GLib.spawn_command_line_sync and extracts the exit code, stdout, and stderr.
 *
 * @param command - The command to execute.
 */
function runCommand(command: string): CommandResult {
    const [, out, err, exitCode] = GLib.spawn_command_line_sync(command);
    const stdout = out ? decodeOutput(out) : '';
    const stderr = err ? decodeOutput(err) : '';
    return {
        exitCode,
        stdout,
        stderr,
    };
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
 * Checks if any of the given executables is installed by using `which`.
 *
 * @description Iterates through a list of executables and returns true if any are found.
 *
 * @param executables - The list of executables to check.
 */
function checkExecutable(executables: string[]): boolean {
    for (const exe of executables) {
        const { exitCode } = runCommand(`which ${exe}`);

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
function checkLibrary(libraries: string[]): boolean {
    for (const lib of libraries) {
        const { exitCode, stdout } = runCommand(`sh -c "ldconfig -p | grep ${lib}"`);

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
function checkServiceStatus(services: string[]): ServiceStatus {
    for (const svc of services) {
        const activeResult = runCommand(`systemctl is-active ${svc}`);
        const activeStatus = activeResult.stdout;

        if (activeStatus === 'active') {
            return 'ACTIVE';
        }

        if (activeStatus === 'inactive' || activeStatus === 'failed') {
            const enabledResult = runCommand(`systemctl is-enabled ${svc}`);
            const enabledStatus = enabledResult.stdout;

            if (enabledResult && (enabledStatus === 'enabled' || enabledStatus === 'static')) {
                return 'INSTALLED';
            } else if (enabledResult && enabledStatus === 'disabled') {
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
            status = checkExecutable(dep.check) ? 'INSTALLED' : 'MISSING';
            break;
        case 'library':
            status = checkLibrary(dep.check) ? 'INSTALLED' : 'MISSING';
            break;
        case 'service':
            status = checkServiceStatus(dep.check);
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

    if (!dep.description) {
        return `  ${colorText(textStatus, color)} ${dep.package}`;
    }

    return `  ${colorText(textStatus, color)} ${dep.package}: ${dep.description ?? ''}`;
}

/**
 * Checks all dependencies and returns a formatted output.
 *
 * @description Gathers the status of both required and optional dependencies and formats the result.
 */
export function checkDependencies(): string {
    try {
        const dependencies: Dependency[] = [
            {
                package: 'wireplumber',
                required: true,
                type: 'executable',
                check: ['wireplumber'],
            },
            {
                package: 'libgtop',
                required: true,
                type: 'library',
                check: ['gtop-2.0'],
            },
            {
                package: 'bluez',
                required: true,
                type: 'service',
                check: ['bluetooth.service'],
            },
            {
                package: 'bluez-utils',
                required: true,
                type: 'executable',
                check: ['bluetoothctl'],
            },
            {
                package: 'networkmanager',
                required: true,
                type: 'service',
                check: ['NetworkManager.service'],
            },
            {
                package: 'dart-sass',
                required: true,
                type: 'executable',
                check: ['sass'],
            },
            {
                package: 'wl-clipboard',
                required: true,
                type: 'executable',
                check: ['wl-copy', 'wl-paste'],
            },
            {
                package: 'upower',
                required: true,
                type: 'service',
                check: ['upower.service'],
            },
            {
                package: 'aylurs-gtk-shell',
                required: true,
                type: 'executable',
                check: ['ags'],
            },

            {
                package: 'python',
                required: false,
                type: 'executable',
                check: ['python', 'python3'],
                description: 'GPU usage tracking (NVidia only)',
            },
            {
                package: 'python-gpustat',
                required: false,
                type: 'executable',
                check: ['gpustat'],
                description: 'GPU usage tracking (NVidia only)',
            },
            {
                package: 'pywal',
                required: false,
                type: 'executable',
                check: ['wal'],
                description: 'Pywal hook for wallpapers',
            },
            {
                package: 'pacman-contrib',
                required: false,
                type: 'executable',
                check: ['paccache', 'rankmirrors'],
                description: 'Checking for pacman updates',
            },
            {
                package: 'power-profiles-daemon',
                required: false,
                type: 'service',
                check: ['power-profiles-daemon.service'],
                description: 'Switch power profiles',
            },
            {
                package: 'swww',
                required: false,
                type: 'executable',
                check: ['swww'],
                description: 'Setting wallpapers',
            },
            {
                package: 'grimblast',
                required: false,
                type: 'executable',
                check: ['grimblast'],
                description: 'For the snapshot shortcut',
            },
            {
                package: 'brightnessctl',
                required: false,
                type: 'executable',
                check: ['brightnessctl'],
                description: 'To control keyboard and screen brightness',
            },
            {
                package: 'btop',
                required: false,
                type: 'executable',
                check: ['btop'],
                description: 'To view system resource usage',
            },
            {
                package: 'gpu-screen-recorder',
                required: false,
                type: 'executable',
                check: ['gpu-screen-recorder'],
                description: 'To use the built-in screen recorder',
            },
            {
                package: 'hyprpicker',
                required: false,
                type: 'executable',
                check: ['hyprpicker'],
                description: 'To use the preset color picker shortcut',
            },
            {
                package: 'matugen',
                required: false,
                type: 'executable',
                check: ['matugen'],
                description: 'To use wallpaper-based color schemes',
            },
        ];

        let output = `${BOLD}Required Dependencies:${RESET}\n`;

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

type CommandResult = {
    exitCode: number;
    stdout: string;
    stderr: string;
};

type DependencyType = 'executable' | 'library' | 'service';

type ServiceStatus = 'ACTIVE' | 'INSTALLED' | 'DISABLED' | 'MISSING';

type Dependency = {
    package: string;
    required: boolean;
    type: DependencyType;
    check: string[];
    description?: string;
};
