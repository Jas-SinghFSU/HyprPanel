import { BarModule, NotificationAnchor, PositionAnchor } from './types/options';
import { OSDAnchor } from './types/options';
import icons, { substitutes } from './icons/icons';
import GLib from 'gi://GLib?version=2.0';
import GdkPixbuf from 'gi://GdkPixbuf';
import { NotificationArgs } from './types/notification';
import { namedColors } from './constants/colors';
import { distroIcons } from './constants/distro';
import { distro } from './variables';
import options from '../options';
import { Astal, Gdk, Gtk } from 'astal/gtk3';
import AstalApps from 'gi://AstalApps?version=0.1';
import { exec, execAsync } from 'astal/process';
import { Gio } from 'astal';

/**
 * Handles errors by throwing a new Error with a message.
 *
 * This function takes an error object and throws a new Error with the provided message or a default message.
 * If the error is an instance of Error, it uses the error's message. Otherwise, it converts the error to a string.
 *
 * @param error The error to handle.
 *
 * @throws Throws a new error with the provided message or a default message.
 */
export function errorHandler(error: unknown): never {
    if (error instanceof Error) {
        throw new Error(error.message);
    }

    throw new Error(String(error));
}

/**
 * Looks up an icon by name and size.
 *
 * This function retrieves an icon from the default icon theme based on the provided name and size.
 * If the name is not provided, it returns null.
 *
 * @param name The name of the icon to look up.
 * @param size The size of the icon to look up. Defaults to 16.
 *
 * @returns The Gtk.IconInfo object if the icon is found, or null if not found.
 */
export function lookUpIcon(name?: string, size = 16): Gtk.IconInfo | null {
    if (!name) return null;

    return Gtk.IconTheme.get_default().lookup_icon(name, size, Gtk.IconLookupFlags.USE_BUILTIN);
}

/**
 * Retrieves all unique layout items from the bar options.
 *
 * This function extracts all unique layout items from the bar options defined in the `options` object.
 * It iterates through the layouts for each monitor and collects items from the left, middle, and right sections.
 *
 * @returns An array of unique layout items.
 */
export function getLayoutItems(): BarModule[] {
    const { layouts } = options.bar;

    const itemsInLayout: BarModule[] = [];

    Object.keys(layouts.get()).forEach((monitor) => {
        const leftItems = layouts.get()[monitor].left;
        const rightItems = layouts.get()[monitor].right;
        const middleItems = layouts.get()[monitor].middle;

        itemsInLayout.push(...leftItems);
        itemsInLayout.push(...middleItems);
        itemsInLayout.push(...rightItems);
    });

    return [...new Set(itemsInLayout)];
}

/**
 * Retrieves the appropriate icon based on the provided name and fallback.
 *
 * This function returns a substitute icon if available, the original name if it exists as a file, or a fallback icon.
 * It also logs a message if no substitute icon is found.
 *
 * @param name The name of the icon to look up.
 * @param fallback The fallback icon to use if the name is not found. Defaults to `icons.missing`.
 *
 * @returns The icon name or the fallback icon.
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
 * Executes a bash command asynchronously.
 *
 * This function runs a bash command using `execAsync` and returns the output as a string.
 * It handles errors by logging them and returning an empty string.
 *
 * @param strings The command to execute as a template string or a regular string.
 * @param values Additional values to interpolate into the command.
 *
 * @returns A promise that resolves to the command output as a string.
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
 * Executes a shell command asynchronously.
 *
 * This function runs a shell command using `execAsync` and returns the output as a string.
 * It handles errors by logging them and returning an empty string.
 *
 * @param cmd The command to execute as a string or an array of strings.
 *
 * @returns A promise that resolves to the command output as a string.
 */
export async function sh(cmd: string | string[]): Promise<string> {
    return execAsync(cmd).catch((err) => {
        console.error(typeof cmd === 'string' ? cmd : cmd.join(' '), err);
        return '';
    });
}

/**
 * Generates an array of JSX elements for each monitor.
 *
 * This function creates an array of JSX elements by calling the provided widget function for each monitor.
 * It uses the number of monitors available in the default Gdk display.
 *
 * @param widget A function that takes a monitor index and returns a JSX element.
 *
 * @returns An array of JSX elements, one for each monitor.
 */
export function forMonitors(widget: (monitor: number) => JSX.Element): JSX.Element[] {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
    return range(n, 0).flatMap(widget);
}

/**
 * Generates an array of numbers within a specified range.
 *
 * This function creates an array of numbers starting from the `start` value up to the specified `length`.
 *
 * @param length The length of the array to generate.
 * @param start The starting value of the range. Defaults to 1.
 *
 * @returns An array of numbers within the specified range.
 */
export function range(length: number, start = 1): number[] {
    return Array.from({ length }, (_, i) => i + start);
}

/**
 * Checks if all specified dependencies are available.
 *
 * This function verifies the presence of the specified binaries using the `which` command.
 * It logs a warning and sends a notification if any dependencies are missing.
 *
 * @param bins The list of binaries to check.
 *
 * @returns True if all dependencies are found, false otherwise.
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
        });
    }

    return missing.length === 0;
}

/**
 * Launches an application in a detached process.
 *
 * This function runs the specified application executable in the background using a bash command.
 * It also increments the application's frequency counter.
 *
 * @param app The application to launch.
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
 * Checks if the provided filepath is a valid image.
 *
 * This function attempts to load an image from the specified filepath using GdkPixbuf.
 * If the image is successfully loaded, it returns true. Otherwise, it logs an error and returns false.
 *
 * @param imgFilePath The path to the image file.
 *
 * @returns True if the filepath is a valid image, false otherwise.
 */
export function isAnImage(imgFilePath: string): boolean {
    try {
        const file = Gio.File.new_for_path(imgFilePath);
        if (!file.query_exists(null)) {
            return false;
        }

        GdkPixbuf.Pixbuf.new_from_file(imgFilePath);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * Sends a notification using the `notify-send` command.
 *
 * This function constructs a notification command based on the provided notification arguments and executes it asynchronously.
 * It logs an error if the notification fails to send.
 *
 * @param notifPayload The notification arguments containing summary, body, appName, iconName, urgency, timeout, category, transient, and id.
 */
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

    execAsync(command)
        .then()
        .catch((err) => {
            console.error(`Failed to send notification: ${err.message}`);
        });
}

/**
 * Maps a notification or OSD anchor position to an Astal window anchor.
 *
 * This function converts a position anchor from the notification or OSD settings to the corresponding Astal window anchor.
 *
 * @param pos The position anchor to convert.
 *
 * @returns The corresponding Astal window anchor.
 */
export function getPosition(pos: NotificationAnchor | OSDAnchor): Astal.WindowAnchor {
    const positionMap: PositionAnchor = {
        top: Astal.WindowAnchor.TOP,
        'top right': Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
        'top left': Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        bottom: Astal.WindowAnchor.BOTTOM,
        'bottom right': Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT,
        'bottom left': Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT,
        right: Astal.WindowAnchor.RIGHT,
        left: Astal.WindowAnchor.LEFT,
    };

    return positionMap[pos] || Astal.WindowAnchor.TOP;
}

/**
 * Validates if a string is a valid GJS color.
 *
 * This function checks if the provided string is a valid color in GJS.
 * It supports named colors, hex colors, RGB, and RGBA formats.
 *
 * @param color The color string to validate.
 *
 * @returns True if the color is valid, false otherwise.
 */
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

/**
 * Capitalizes the first letter of a string.
 *
 * This function takes a string and returns a new string with the first letter capitalized.
 *
 * @param str The string to capitalize.
 *
 * @returns The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Retrieves the icon for the current distribution.
 *
 * This function returns the icon associated with the current distribution based on the `distroIcons` array.
 * If no icon is found, it returns a default icon.
 *
 * @returns The icon for the current distribution as a string.
 */
export function getDistroIcon(): string {
    const icon = distroIcons.find(([id]) => id === distro.id);
    return icon ? icon[1] : ''; // default icon if not found
}

/**
 * Checks if an event is a primary click.
 *
 * This function determines if the provided event is a primary click based on the button property.
 *
 * @param event The click event to check.
 *
 * @returns True if the event is a primary click, false otherwise.
 */
export const isPrimaryClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_PRIMARY;

/**
 * Checks if an event is a secondary click.
 *
 * This function determines if the provided event is a secondary click based on the button property.
 *
 * @param event The click event to check.
 *
 * @returns True if the event is a secondary click, false otherwise.
 */
export const isSecondaryClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_SECONDARY;

/**
 * Checks if an event is a middle click.
 *
 * This function determines if the provided event is a middle click based on the button property.
 *
 * @param event The click event to check.
 *
 * @returns True if the event is a middle click, false otherwise.
 */
export const isMiddleClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_MIDDLE;

/**
 * Checks if an event is a scroll up.
 *
 * This function determines if the provided event is a scroll up based on the direction property.
 *
 * @param event The scroll event to check.
 *
 * @returns True if the event is a scroll up, false otherwise.
 */
export const isScrollUp = (event: Astal.ScrollEvent): boolean => event.direction === Gdk.ScrollDirection.UP;

/**
 * Checks if an event is a scroll down.
 *
 * This function determines if the provided event is a scroll down based on the direction property.
 *
 * @param event The scroll event to check.
 *
 * @returns True if the event is a scroll down, false otherwise.
 */
export const isScrollDown = (event: Astal.ScrollEvent): boolean => event.direction === Gdk.ScrollDirection.DOWN;
