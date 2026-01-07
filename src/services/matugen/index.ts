import { ColorMapKey, HexColor, MatugenColors } from '../../lib/options/types';
import { getMatugenVariations } from './variations';
import icons from '../../lib/icons/icons';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import options from 'src/configuration';
import { isAnImage } from 'src/lib/validation/images';
import { defaultColorMap } from './defaults';
import { normalizeToAbsolutePath } from 'src/lib/path/helpers';

const MATUGEN_ENABLED = options.theme.matugen;
const MATUGEN_SETTINGS = options.theme.matugen_settings;

/**
 * Service that integrates with Matugen to generate color schemes from wallpapers
 */
export class MatugenService {
    private static _instance: MatugenService;

    private constructor() {}

    /**
     * Gets the singleton instance of the MatugenService
     *
     * @returns The MatugenService instance
     */
    public static getInstance(): MatugenService {
        if (this._instance === undefined) {
            this._instance = new MatugenService();
        }

        return this._instance;
    }

    /**
     * Normalizes contrast value to be within Matugen's acceptable range
     *
     * @param contrast - The raw contrast value
     * @returns Normalized contrast value between -1 and 1
     */
    private _normalizeContrast(contrast: number): number {
        return Math.max(-1, Math.min(1, contrast));
    }

    /**
     * Generates a color scheme from the current wallpaper using Matugen
     *
     * @returns The generated color palette or undefined if generation fails
     */
    public async generateMatugenColors(): Promise<MatugenColors | undefined> {
        if (!MATUGEN_ENABLED.get()) {
            console.warn('[Matugen] Matugen is disabled in settings');
            return;
        }

        if (!SystemUtilities.checkDependencies('matugen')) {
            console.error('[Matugen] matugen command not found. Please install matugen.');
            SystemUtilities.notify({
                summary: 'Matugen Failed',
                body: 'matugen command not found. Please install matugen.',
                iconName: icons.ui.warning,
            });
            return;
        }

        const wallpaperPath = options.wallpaper.image.get();

        if (!wallpaperPath) {
            SystemUtilities.notify({
                summary: 'Matugen Failed',
                body: "Please select a wallpaper in 'Theming > General' first.",
                iconName: icons.ui.warning,
            });
            return;
        }

        const normalizedPath = normalizeToAbsolutePath(wallpaperPath);

        if (!isAnImage(normalizedPath)) {
            console.warn(`[Matugen] Invalid wallpaper path or not an image: ${normalizedPath}`);
            SystemUtilities.notify({
                summary: 'Matugen Failed',
                body: `Invalid wallpaper path: ${wallpaperPath}`,
                iconName: icons.ui.warning,
            });
            return;
        }

        try {
            const normalizedContrast = this._normalizeContrast(MATUGEN_SETTINGS.contrast.get());
            const schemeType = MATUGEN_SETTINGS.scheme_type.get();
            const mode = MATUGEN_SETTINGS.mode.get();

            const baseCommand = `matugen image -q "${normalizedPath}" -t scheme-${schemeType} --mode ${mode} --contrast ${normalizedContrast}`;

            const jsonResult = await SystemUtilities.bash(`${baseCommand} --dry-run --json hex`);

            if (!jsonResult || jsonResult.trim().length === 0) {
                console.error('[Matugen] Matugen returned empty output');
                throw new Error('Matugen returned empty output');
            }

            await SystemUtilities.bash(baseCommand);

            const parsedResult = JSON.parse(jsonResult);

            if (!parsedResult?.colors) {
                console.error('[Matugen] Parsed result missing colors:', parsedResult);
                throw new Error('Matugen result missing colors');
            }

            let colors = parsedResult.colors;

            const processedColors: Record<string, string> = {};
            for (const [key, value] of Object.entries(colors)) {
                if (typeof value === 'string') {
                    processedColors[key] = value;
                } else {
                    const obj = value as Record<string, string>;
                    processedColors[key] = obj[mode] ?? obj.default;
                }
            }
            colors = processedColors;

            return colors;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[Matugen] Error generating colors: ${errorMessage}`, error);
            SystemUtilities.notify({
                summary: 'Matugen Error',
                body: `An error occurred: ${errorMessage}`,
                iconName: icons.ui.info,
            });
            return;
        }
    }

    /**
     * Validates if a color string is a valid key in the default color map
     *
     * @param color - The color key to validate
     * @returns Whether the color is a valid ColorMapKey
     */
    public isColorKeyValid(color: string): color is ColorMapKey {
        return Object.prototype.hasOwnProperty.call(defaultColorMap, color);
    }

    /**
     * Maps a default color hex value to its Matugen-generated equivalent
     *
     * @param incomingHex - The original hex color to map
     * @param matugenColors - The Matugen color palette to use for mapping (must be destructured hex strings, not objects)
     * @returns The mapped hex color or original if no mapping exists
     */
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
                const mappedColor = matugenVariation[colorKey] ?? incomingHex;
                return mappedColor;
            }
        }

        return incomingHex;
    }
}
