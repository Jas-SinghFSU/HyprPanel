import { defaultColorMap } from '../../lib/types/defaults/options';
import { ColorMapValue, ColorMapKey, HexColor, MatugenColors } from '../../lib/types/options';
import { getMatugenVariations } from './variations';
import { bash, dependencies, Notify, isAnImage } from '../../lib/utils';
import options from '../../options';
import icons from '../../lib/icons/icons';
import Variable from 'astal/variable';
const { scheme_type, contrast } = options.theme.matugen_settings;
const { matugen } = options.theme;

const updateOptColor = (color: HexColor, opt: Variable<HexColor>): void => {
    opt.set(color);
};

export async function generateMatugenColors(): Promise<MatugenColors | undefined> {
    if (!matugen.get() || !dependencies('matugen')) {
        return;
    }
    const wallpaperPath = options.wallpaper.image.get();

    try {
        if (!wallpaperPath.length || !isAnImage(wallpaperPath)) {
            Notify({
                summary: 'Matugen Failed',
                body: "Please select a wallpaper in 'Theming > General' first.",
                iconName: icons.ui.warning,
            });
            return;
        }

        const normalizedContrast = contrast.get() > 1 ? 1 : contrast.get() < -1 ? -1 : contrast.get();
        const contents = await bash(
            `matugen image --dry-run -q ${wallpaperPath} -t scheme-${scheme_type.get()} --contrast ${normalizedContrast} --json hex`,
        );

        return JSON.parse(contents).colors[options.theme.matugen_settings.mode.get()];
    } catch (error) {
        const errMsg = `An error occurred while generating matugen colors: ${error}`;
        console.error(errMsg);
        return;
    }
}

const isColorValid = (color: string): color is ColorMapKey => {
    return defaultColorMap.hasOwnProperty(color);
};

export const replaceHexValues = (incomingHex: HexColor, matugenColors: MatugenColors): HexColor => {
    if (!options.theme.matugen.get()) {
        return incomingHex;
    }

    const matugenVariation = getMatugenVariations(matugenColors, options.theme.matugen_settings.variation.get());
    updateOptColor(matugenVariation.base, options.theme.bar.menus.menu.media.card.color as Variable<HexColor>);

    for (const curColor of Object.keys(defaultColorMap)) {
        const currentColor: string = curColor;
        if (!isColorValid(currentColor)) {
            continue;
        }

        const curColorValue: ColorMapValue = defaultColorMap[currentColor];
        if (curColorValue === incomingHex) {
            return matugenVariation[currentColor];
        }
    }

    return incomingHex;
};

export const getMatugenHex = (incomingHex: HexColor, matugenColors: MatugenColors): HexColor => {
    const matugenVariation = getMatugenVariations(matugenColors, options.theme.matugen_settings.variation.get());

    for (const curColor of Object.keys(defaultColorMap)) {
        if (!isColorValid(curColor)) {
            continue;
        }

        const curColorValue: ColorMapValue = defaultColorMap[curColor];

        if (curColorValue === incomingHex) {
            return matugenVariation[curColor];
        }
    }

    return incomingHex;
};
