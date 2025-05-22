import { ColorMapKey, HexColor, MatugenColors } from '../../lib/options/types';
import { getMatugenVariations } from './variations';
import icons from '../../lib/icons/icons';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import options from 'src/configuration';
import { isAnImage } from 'src/lib/validation/images';
import { defaultColorMap } from './defaults';

const MATUGEN_ENABLED = options.theme.matugen;
const MATUGEN_SETTINGS = options.theme.matugen_settings;

export class MatugenService {
    private static _instance: MatugenService;

    public static getDefault(): MatugenService {
        if (this._instance === undefined) {
            this._instance = new MatugenService();
        }

        return this._instance;
    }

    private _normalizeContrast(contrast: number): number {
        return Math.max(-1, Math.min(1, contrast));
    }

    public async generateMatugenColors(): Promise<MatugenColors | undefined> {
        if (!MATUGEN_ENABLED.get() || !SystemUtilities.checkDependencies('matugen')) {
            return;
        }

        const wallpaperPath = options.wallpaper.image.get();

        if (!wallpaperPath || !isAnImage(wallpaperPath)) {
            SystemUtilities.notify({
                summary: 'Matugen Failed',
                body: "Please select a wallpaper in 'Theming > General' first.",
                iconName: icons.ui.warning,
            });

            return;
        }

        try {
            const normalizedContrast = this._normalizeContrast(MATUGEN_SETTINGS.contrast.get());
            const schemeType = MATUGEN_SETTINGS.scheme_type.get();
            const mode = MATUGEN_SETTINGS.mode.get();

            const baseCommand = `matugen image -q "${wallpaperPath}" -t scheme-${schemeType} --contrast ${normalizedContrast}`;

            const jsonResult = await SystemUtilities.bash(`${baseCommand} --dry-run --json hex`);
            await SystemUtilities.bash(baseCommand);

            const parsedResult = JSON.parse(jsonResult);
            return parsedResult?.colors?.[mode];
        } catch (error) {
            SystemUtilities.notify({
                summary: 'Matugen Error',
                body: `An error occurred: ${error}`,
                iconName: icons.ui.info,
            });
            console.error(`An error occurred while generating matugen colors: ${error}`);
            return;
        }
    }

    public isColorKeyValid(color: string): color is ColorMapKey {
        return Object.prototype.hasOwnProperty.call(defaultColorMap, color);
    }

    public getMatugenHex(incomingHex: HexColor, matugenColors?: MatugenColors): HexColor {
        if (!MATUGEN_ENABLED.get() || !matugenColors) {
            return incomingHex;
        }

        const variation = MATUGEN_SETTINGS.variation.get();
        const matugenVariation = getMatugenVariations(matugenColors, variation);

        for (const colorKey of Object.keys(defaultColorMap)) {
            if (!this.isColorKeyValid(colorKey)) {
                continue;
            }

            const colorValue = defaultColorMap[colorKey];
            if (colorValue === incomingHex) {
                return matugenVariation[colorKey] ?? incomingHex;
            }
        }

        return incomingHex;
    }
}
