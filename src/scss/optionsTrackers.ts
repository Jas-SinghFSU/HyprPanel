import icons from '../lib/icons/icons';
import { bash, dependencies, Notify, isAnImage } from '../lib/utils';
import options from '../options';
import Wallpaper from '../services/Wallpaper';

const { matugen } = options.theme;

const ensureMatugenWallpaper = (): void => {
    const wallpaperPath = options.wallpaper.image.get();

    if (matugen.get() && (!options.wallpaper.image.get().length || !isAnImage(wallpaperPath))) {
        Notify({
            summary: 'Matugen Failed',
            body: "Please select a wallpaper in 'Theming > General' first.",
            iconName: icons.ui.warning,
            timeout: 7000,
        });
        matugen.set(false);
    }
};

export const initializeTrackers = (resetCssFunc: () => void): void => {
    matugen.subscribe(() => {
        ensureMatugenWallpaper();
    });

    Wallpaper.connect('changed', () => {
        console.info('Wallpaper changed, regenerating Matugen colors...');
        if (options.theme.matugen.get()) {
            resetCssFunc();
        }
    });

    options.wallpaper.image.subscribe(() => {
        if ((!Wallpaper.isRunning() && options.theme.matugen.get()) || !options.wallpaper.enable.get()) {
            console.info('Wallpaper path changed, regenerating Matugen colors...');
            resetCssFunc();
        }
        if (options.wallpaper.pywal.get() && dependencies('wal')) {
            const wallpaperPath = options.wallpaper.image.get();
            bash(`wal -i ${wallpaperPath}`);
        }
    });
};
