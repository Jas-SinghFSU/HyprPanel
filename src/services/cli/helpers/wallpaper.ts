import GLib from 'gi://GLib?version=2.0';
import options from 'src/configuration';
import { WallpaperService } from 'src/services/wallpaper';

const wallpaperService = WallpaperService.getInstance();
const { EXISTS, IS_REGULAR } = GLib.FileTest;
const { enable: enableWallpaper, image } = options.wallpaper;

/**
 * Sets the system wallpaper to the specified image file
 *
 * @param filePath - The absolute path to the wallpaper image file
 * @throws Error if the file doesn't exist or is not a regular file
 * @throws Error if setting the wallpaper fails
 */
export function setWallpaper(filePath: string): void {
    if (!(GLib.file_test(filePath, EXISTS) && GLib.file_test(filePath, IS_REGULAR))) {
        throw new Error('The input file is not a valid wallpaper.');
    }

    image.set(filePath);

    if (!enableWallpaper.get()) {
        return;
    }
    try {
        wallpaperService.setWallpaper(filePath);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(`An error occurred while setting the wallpaper: ${error}`);
        }
    }
}
