import { defaultColorMap } from "lib/types/defaults/options";
import { HexColor, MatugenColors } from "lib/types/options";
import { getMatugenVariations } from "./variations";
import { bash, dependencies, Notify, isAnImage } from "lib/utils";
import options from "options";
import icons from "lib/icons";
const { scheme_type, contrast } = options.theme.matugen_settings;
const { matugen } = options.theme;

export async function generateMatugenColors(): Promise<MatugenColors | undefined> {
    if (!matugen.value || !dependencies('matugen')) {
        return;
    }
    const wallpaperPath = options.wallpaper.image.value;

    try {
        if (!wallpaperPath.length || !isAnImage(wallpaperPath)) {
            Notify({
                summary: "Matugen Failed",
                body: "Please select a wallpaper in 'Theming > General' first.",
                iconName: icons.ui.warning,
                timeout: 7000
            })
            return;
        }

        const normalizedContrast = contrast.value > 1 ? 1
            : contrast.value < -1 ? -1
                : contrast.value
        const contents = await bash(`matugen image ${wallpaperPath} -t scheme-${scheme_type.value} --contrast ${normalizedContrast} --json hex`);

        return JSON.parse(contents).colors[options.theme.matugen_settings.mode.value];
    } catch (error) {
        const errMsg = `An error occurred while generating matugen colors: ${error}`;
        console.error(errMsg);
        return;
    }
}

export const replaceHexValues = (incomingHex: HexColor, matugenColors: MatugenColors): HexColor => {
    if (!options.theme.matugen.value) {
        return incomingHex;
    }

    const matugenVariation = getMatugenVariations(matugenColors, options.theme.matugen_settings.variation.value);
    for (let curColor of Object.keys(defaultColorMap)) {
        if (defaultColorMap[curColor] === incomingHex) {
            return matugenVariation[curColor];
        }
    }

    return incomingHex;
}
