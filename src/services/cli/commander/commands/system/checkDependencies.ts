import { errorHandler } from 'src/core/errors/handler';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { ServiceStatus } from 'src/core/system/types';

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
                package: 'wf-recorder',
                required: false,
                type: 'executable',
                check: ['wf-recorder'],
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

type DependencyType = 'executable' | 'library' | 'service';

type Dependency = {
    package: string;
    required: boolean;
    type: DependencyType;
    check: string[];
    description?: string;
};
