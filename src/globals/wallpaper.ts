import GLib from 'gi://GLib?version=2.0';
import { Notify } from 'src/lib/utils';
import options from 'options';
import Wallpaper from 'src/services/Wallpaper';

const { EXISTS, IS_REGULAR } = GLib.FileTest;
const { enable: enableWallpaper, image } = options.wallpaper;

globalThis.setWallpaper = (filePath: string): void => {
    if (!(GLib.file_test(filePath, EXISTS) && GLib.file_test(filePath, IS_REGULAR))) {
        Notify({
            summary: 'Failed to set Wallpaper',
            body: 'The input file is not a valid wallpaper.',
        });
    }

    image.value = filePath;

    if (enableWallpaper.value) {
        Wallpaper.set(filePath);
    }
};
