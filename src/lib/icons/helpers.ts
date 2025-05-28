import { Gtk } from 'astal/gtk3';

/**
 * Looks up an icon by name and size
 * @param name - The name of the icon to look up
 * @param size - The size of the icon to look up. Defaults to 16
 * @returns The Gtk.IconInfo object if the icon is found, or null if not found
 */
export function lookUpIcon(name?: string, size = 16): Gtk.IconInfo | null {
    if (name === undefined) return null;

    return Gtk.IconTheme.get_default().lookup_icon(name, size, Gtk.IconLookupFlags.USE_BUILTIN);
}

/**
 * Checks if an icon exists in the theme
 * @param name - The name of the icon to check
 * @returns True if the icon exists, false otherwise
 */
export function iconExists(name: string): boolean {
    return lookUpIcon(name) !== null;
}

/**
 * Gets an icon name with fallback
 * @param primary - The primary icon name to try
 * @param fallback - The fallback icon name if primary doesn't exist
 * @returns The primary icon if it exists, otherwise the fallback
 */
export function getIconWithFallback(primary: string, fallback: string): string {
    return iconExists(primary) ? primary : fallback;
}
