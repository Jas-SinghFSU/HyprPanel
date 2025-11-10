import GObject from 'astal/gobject';
import options from 'src/configuration';
import { normalizeToAbsolutePath } from 'src/lib/path/helpers';
import icons from '../lib/icons/icons';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { WallpaperService } from 'src/services/wallpaper';
import { isAnImage } from 'src/lib/validation/images';

const wallpaperService = WallpaperService.getInstance();

const { matugen } = options.theme;

const ensureMatugenWallpaper = (): void => {
    const wallpaperPath = options.wallpaper.image.get();

    if (matugen.get() && (!wallpaperPath.length || !isAnImage(normalizeToAbsolutePath(wallpaperPath)))) {
        SystemUtilities.notify({
            summary: 'Matugen Failed',
            body: "Please select a wallpaper in 'Theming > General' first.",
            iconName: icons.ui.warning,
        });
        matugen.set(false);
    }
};

export const initializeTrackers = (resetCssFunc: () => void): void => {
    matugen.subscribe(() => {
        ensureMatugenWallpaper();
    });

    (wallpaperService as GObject.Object).connect('changed', () => {
        console.info('Wallpaper changed, regenerating Matugen colors...');
        if (options.theme.matugen.get()) {
            resetCssFunc();
        }
    });

    options.wallpaper.image.subscribe(() => {
        if (
            (!wallpaperService.isRunning() && options.theme.matugen.get()) ||
            !options.wallpaper.enable.get()
        ) {
            console.info('Wallpaper path changed, regenerating Matugen colors...');
            resetCssFunc();
        }
        if (options.wallpaper.pywal.get() && SystemUtilities.checkDependencies('wal')) {
            const wallpaperPath = options.wallpaper.image.get();
            SystemUtilities.bash(`wal -i "${wallpaperPath}"`);
        }
    });
};
