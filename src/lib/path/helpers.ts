import { GLib } from 'astal';

/**
 * Normalize a path to the absolute representation of the path
 * Note: This will only expand '~' if present. Path traversal is not supported
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizeToAbsolutePath(path: string): string {
    if (path.charAt(0) === '~') {
        return path.replace('~', GLib.get_home_dir());
    }

    return path;
}

/**
 * Gets the home directory path
 * @returns The home directory path
 */
export function getHomeDir(): string {
    return GLib.get_home_dir();
}

/**
 * Joins path segments
 * @param segments - Path segments to join
 * @returns The joined path
 */
export function joinPath(...segments: string[]): string {
    return segments.join('/').replace(/\/+/g, '/');
}
