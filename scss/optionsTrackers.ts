import icons from 'lib/icons';
import { bash, dependencies, Notify, isAnImage } from 'lib/utils';
import options from 'options';
import Wallpaper from 'services/Wallpaper';

const { matugen } = options.theme;
const { mode, scheme_type, contrast } = options.theme.matugen_settings;

const ensureMatugenWallpaper = (): void => {
    const wallpaperPath = options.wallpaper.image.value;

    if (matugen.value && (!options.wallpaper.image.value.length || !isAnImage(wallpaperPath))) {
        Notify({
            summary: 'Matugen Failed',
            body: "Please select a wallpaper in 'Theming > General' first.",
            iconName: icons.ui.warning,
            timeout: 7000,
        });
        matugen.value = false;
    }
};

export const initializeTrackers = (resetCssFunc: () => void): void => {
    matugen.connect('changed', () => {
        ensureMatugenWallpaper();
        options.resetTheme();
    });

    mode.connect('changed', () => {
        options.resetTheme();
    });
    scheme_type.connect('changed', () => {
        options.resetTheme();
    });
    contrast.connect('changed', () => {
        options.resetTheme();
    });

    Wallpaper.connect('changed', () => {
        console.info('Wallpaper changed, regenerating Matugen colors...');
        if (options.theme.matugen.value) {
            options.resetTheme();
            resetCssFunc();
        }
    });

    options.wallpaper.image.connect('changed', () => {
        if ((!Wallpaper.isRunning() && options.theme.matugen.value) || !options.wallpaper.enable.value) {
            console.info('Wallpaper path changed, regenerating Matugen colors...');
            options.resetTheme();
            resetCssFunc();
        }
        if (options.wallpaper.pywal.value && dependencies('wal')) {
            const wallpaperPath = options.wallpaper.image.value;
            bash(`wal -i ${wallpaperPath}`);
        }
    });
};
