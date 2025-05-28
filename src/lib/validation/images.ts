import GdkPixbuf from 'gi://GdkPixbuf';
import { normalizeToAbsolutePath } from '../path/helpers';

/**
 * Checks if the provided filepath is a valid image
 * Note: Unlike GdkPixbuf, this function will normalize the given path
 * @param imgFilePath - The path to the image file
 * @returns True if the filepath is a valid image, false otherwise
 */
export function isAnImage(imgFilePath: string): boolean {
    try {
        GdkPixbuf.Pixbuf.new_from_file(normalizeToAbsolutePath(imgFilePath));
        return true;
    } catch (error) {
        console.info(error);
        return false;
    }
}
