import GLib from 'gi://GLib?version=2.0';
import options from '../options';
import Wallpaper from 'src/services/Wallpaper';

const { EXISTS, IS_REGULAR } = GLib.FileTest;
const { enable: enableWallpaper, image } = options.wallpaper;

globalThis.setWallpaper = (filePath: string): void => {
    if (!(GLib.file_test(filePath, EXISTS) && GLib.file_test(filePath, IS_REGULAR))) {
        throw new Error('The input file is not a valid wallpaper.');
    }

    image.set(filePath);

    if (!enableWallpaper.get()) {
        return;
    }
    try {
        Wallpaper.setWallpaper(filePath);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(`An error occurred while setting the wallpaper: ${error}`);
        }
    }
};
