import { defaultColorMap } from "lib/types/defaults/options";
import { MatugenColors } from "lib/types/options";
import { getMatugenVariations } from "./variations";
import { bash, dependencies } from "lib/utils";
import options from "options";
const { scheme_type, contrast } = options.theme.matugen_settings;

export async function generateMatugenColors() {
    if (!dependencies('matugen')) {
        return;
    }

    try {
        const normalizedContrast = contrast.value > 1 ? 1
            : contrast.value < -1 ? -1
                : contrast.value
        const wallpaperPath = options.wallpaper.image.value;
        const contents = await bash(`matugen image ${wallpaperPath} -t scheme-${scheme_type.value} --contrast ${normalizedContrast} --json hex`);

        return JSON.parse(contents).colors[options.theme.matugen_settings.mode.value];
    } catch (error) {
        const errMsg = `An error occurred while generating matugen colors: ${error}`;
        console.error(errMsg);
    }
}

export const replaceHexValues = (incomingHex: string, matugenColors: MatugenColors) => {
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
