import { BarModule, NotificationAnchor } from './types/options';
import { OSDAnchor } from './types/options';
import icons, { substitutes } from './icons/icons';
import GLib from 'gi://GLib?version=2.0';
import GdkPixbuf from 'gi://GdkPixbuf';
import { NotificationArgs } from './types/notification';
import { namedColors } from './constants/colors';
import { distroIcons } from './constants/distro';
import { distro } from './variables';
import options from '../options';
import { Gdk, Gtk } from 'astal/gtk3';
import AstalApps from 'gi://AstalApps?version=0.1';
import { exec, execAsync } from 'astal/process';
import AstalBattery from 'gi://AstalBattery?version=0.1';
import { GtkWidget } from './types/widget';

const battery = AstalBattery.get_default();

export function lookUpIcon(name?: string, size = 16): Gtk.IconInfo | null {
    if (!name) return null;

    return Gtk.IconTheme.get_default().lookup_icon(name, size, Gtk.IconLookupFlags.USE_BUILTIN);
}

/**
 * Retrieves all unique layout items from the bar options.
 *
 * @returns An array of unique layout items.
 */
export function getLayoutItems(): BarModule[] {
    const { layouts } = options.bar;

    const itemsInLayout: BarModule[] = [];

    Object.keys(layouts.value).forEach((monitor) => {
        const leftItems = layouts.value[monitor].left;
        const rightItems = layouts.value[monitor].right;
        const middleItems = layouts.value[monitor].middle;

        itemsInLayout.push(...leftItems);
        itemsInLayout.push(...middleItems);
        itemsInLayout.push(...rightItems);
    });

    return [...new Set(itemsInLayout)];
}

/**
 * @returns substitute icon || name || fallback icon
 */
export function icon(name: string | null, fallback = icons.missing): string {
    const validateSubstitute = (name: string): name is keyof typeof substitutes => name in substitutes;

    if (!name) return fallback || '';

    if (GLib.file_test(name, GLib.FileTest.EXISTS)) return name;

    let icon: string = name;

    if (validateSubstitute(name)) {
        icon = substitutes[name];
    }

    if (lookUpIcon(icon)) return icon;

    print(`no icon substitute "${icon}" for "${name}", fallback: "${fallback}"`);
    return fallback;
}

/**
 * @returns execAsync(["bash", "-c", cmd])
 */
export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]): Promise<string> {
    const cmd =
        typeof strings === 'string' ? strings : strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

    return execAsync(['bash', '-c', cmd]).catch((err) => {
        console.error(cmd, err);
        return '';
    });
}

/**
 * @returns execAsync(cmd)
 */
export async function sh(cmd: string | string[]): Promise<string> {
    return execAsync(cmd).catch((err) => {
        console.error(typeof cmd === 'string' ? cmd : cmd.join(' '), err);
        return '';
    });
}

export function forMonitors(widget: (monitor: number) => GtkWidget): GtkWidget[] {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
    return range(n, 0).flatMap(widget);
}

/**
 * @returns [start...length]
 */
export function range(length: number, start = 1): number[] {
    return Array.from({ length }, (_, i) => i + start);
}

/**
 * @returns true if all of the `bins` are found
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
        Notify({
            summary: 'Dependencies not found!',
            body: `The following dependencies are missing: ${missing.join(', ')}`,
            iconName: icons.ui.warning,
            timeout: 7000,
        });
    }

    return missing.length === 0;
}

/**
 * run app detached
 */
export function launchApp(app: AstalApps.Application): void {
    const exe = app.executable
        .split(/\s+/)
        .filter((str) => !str.startsWith('%') && !str.startsWith('@'))
        .join(' ');

    bash(`${exe} &`);
    app.frequency += 1;
}

/**
 * Ensure that the provided filepath is a valid image
 */
export function isAnImage(imgFilePath: string): boolean {
    try {
        GdkPixbuf.Pixbuf.new_from_file(imgFilePath);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function Notify(notifPayload: NotificationArgs): void {
    let command = 'notify-send';
    command += ` "${notifPayload.summary} "`;
    if (notifPayload.body) command += ` "${notifPayload.body}" `;
    if (notifPayload.appName) command += ` -a "${notifPayload.appName}"`;
    if (notifPayload.iconName) command += ` -i "${notifPayload.iconName}"`;
    if (notifPayload.urgency) command += ` -u "${notifPayload.urgency}"`;
    if (notifPayload.timeout !== undefined) command += ` -t ${notifPayload.timeout}`;
    if (notifPayload.category) command += ` -c "${notifPayload.category}"`;
    if (notifPayload.transient) command += ` -e`;
    if (notifPayload.id !== undefined) command += ` -r ${notifPayload.id}`;

    execAsync(command);
}

export function getPosition(pos: NotificationAnchor | OSDAnchor): ('top' | 'bottom' | 'left' | 'right')[] {
    const positionMap: { [key: string]: ('top' | 'bottom' | 'left' | 'right')[] } = {
        top: ['top'],
        'top right': ['top', 'right'],
        'top left': ['top', 'left'],
        bottom: ['bottom'],
        'bottom right': ['bottom', 'right'],
        'bottom left': ['bottom', 'left'],
        right: ['right'],
        left: ['left'],
    };

    return positionMap[pos] || ['top'];
}
export function isValidGjsColor(color: string): boolean {
    const colorLower = color.toLowerCase().trim();

    if (namedColors.has(colorLower)) {
        return true;
    }

    const hexColorRegex = /^#(?:[a-fA-F0-9]{3,4}|[a-fA-F0-9]{6,8})$/;

    const rgbRegex = /^rgb\(\s*(\d{1,3}%?\s*,\s*){2}\d{1,3}%?\s*\)$/;
    const rgbaRegex = /^rgba\(\s*(\d{1,3}%?\s*,\s*){3}(0|1|0?\.\d+)\s*\)$/;

    if (hexColorRegex.test(color)) {
        return true;
    }

    if (rgbRegex.test(colorLower) || rgbaRegex.test(colorLower)) {
        return true;
    }

    return false;
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDistroIcon(): string {
    const icon = distroIcons.find(([id]) => id === distro.id);
    return icon ? icon[1] : ''; // default icon if not found
}

export function warnOnLowBattery(): void {
    battery.connect('notify::percent', () => {
        const { lowBatteryThreshold, lowBatteryNotification, lowBatteryNotificationText, lowBatteryNotificationTitle } =
            options.menus.power;
        if (!lowBatteryNotification.value || battery.charging) return;
        const lowThreshold = lowBatteryThreshold.value;

        if (battery.percentage === lowThreshold || battery.percentage === lowThreshold / 2) {
            Notify({
                summary: lowBatteryNotificationTitle.value.replace('/$POWER_LEVEL/g', battery.percentage.toString()),
                body: lowBatteryNotificationText.value.replace('/$POWER_LEVEL/g', battery.percentage.toString()),
                iconName: icons.ui.warning,
                urgency: 'critical',
                timeout: 7000,
            });
        }
    });
}
