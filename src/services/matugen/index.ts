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

        // Check if it's a valid image file
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

            // Matugen returns colors as objects with mode-based properties when using --json hex
            // Structure before destructuring:
            // {
            //   colors: {
            //     background: { dark: "#0f1512", default: "#0f1512", light: "#f5fbf6" },
            //     error: { dark: "#ba1a1a", default: "#ba1a1a", light: "#de3730" },
            //     error_container: { dark: "#93000a", default: "#93000a", light: "#ffdad6" },
            //     inverse_on_surface: { dark: "#1a1c19", default: "#1a1c19", light: "#f0f0f0" },
            //     inverse_primary: { dark: "#006c4c", default: "#006c4c", light: "#4dd0a6" },
            //     inverse_surface: { dark: "#1a1c19", default: "#1a1c19", light: "#f0f0f0" },
            //     on_background: { dark: "#e1e3de", default: "#e1e3de", light: "#1a1c19" },
            //     on_error: { dark: "#ffffff", default: "#ffffff", light: "#ffffff" },
            //     on_error_container: { dark: "#ffdad6", default: "#ffdad6", light: "#410002" },
            //     on_primary: { dark: "#003829", default: "#003829", light: "#ffffff" },
            //     on_primary_container: { dark: "#00513c", default: "#00513c", light: "#002114" },
            //     on_primary_fixed: { dark: "#002114", default: "#002114", light: "#002114" },
            //     on_primary_fixed_variant: { dark: "#00513c", default: "#00513c", light: "#00513c" },
            //     on_secondary: { dark: "#1a3529", default: "#1a3529", light: "#ffffff" },
            //     on_secondary_container: { dark: "#1e4d3a", default: "#1e4d3a", light: "#002114" },
            //     on_secondary_fixed: { dark: "#002114", default: "#002114", light: "#002114" },
            //     on_secondary_fixed_variant: { dark: "#1e4d3a", default: "#1e4d3a", light: "#1e4d3a" },
            //     on_surface: { dark: "#e1e3de", default: "#e1e3de", light: "#1a1c19" },
            //     on_surface_variant: { dark: "#c1c9c0", default: "#c1c9c0", light: "#414942" },
            //     on_tertiary: { dark: "#1a2836", default: "#1a2836", light: "#ffffff" },
            //     on_tertiary_container: { dark: "#1e3a52", default: "#1e3a52", light: "#001e2e" },
            //     on_tertiary_fixed: { dark: "#001e2e", default: "#001e2e", light: "#001e2e" },
            //     on_tertiary_fixed_variant: { dark: "#1e3a52", default: "#1e3a52", light: "#1e3a52" },
            //     outline: { dark: "#8b9389", default: "#8b9389", light: "#71796f" },
            //     outline_variant: { dark: "#414942", default: "#414942", light: "#c1c9c0" },
            //     primary: { dark: "#4dd0a6", default: "#4dd0a6", light: "#006c4c" },
            //     primary_container: { dark: "#00513c", default: "#00513c", light: "#4dd0a6" },
            //     primary_fixed: { dark: "#4dd0a6", default: "#4dd0a6", light: "#4dd0a6" },
            //     primary_fixed_dim: { dark: "#2fb58a", default: "#2fb58a", light: "#2fb58a" },
            //     scrim: { dark: "#000000", default: "#000000", light: "#000000" },
            //     secondary: { dark: "#2fb58a", default: "#2fb58a", light: "#4dd0a6" },
            //     secondary_container: { dark: "#1e4d3a", default: "#1e4d3a", light: "#2fb58a" },
            //     secondary_fixed: { dark: "#2fb58a", default: "#2fb58a", light: "#2fb58a" },
            //     secondary_fixed_dim: { dark: "#119a6f", default: "#119a6f", light: "#119a6f" },
            //     shadow: { dark: "#000000", default: "#000000", light: "#000000" },
            //     surface: { dark: "#111411", default: "#111411", light: "#f7faf7" },
            //     surface_bright: { dark: "#373a37", default: "#373a37", light: "#f7faf7" },
            //     surface_container: { dark: "#1b1e1b", default: "#1b1e1b", light: "#ecf0ec" },
            //     surface_container_high: { dark: "#252825", default: "#252825", light: "#e6ebe6" },
            //     surface_container_highest: { dark: "#303330", default: "#303330", light: "#e0e5e0" },
            //     surface_container_low: { dark: "#161916", default: "#161916", light: "#f2f6f2" },
            //     surface_container_lowest: { dark: "#0c0f0c", default: "#0c0f0c", light: "#ffffff" },
            //     surface_dim: { dark: "#111411", default: "#111411", light: "#d8dbd7" },
            //     surface_variant: { dark: "#414942", default: "#414942", light: "#c1c9c0" },
            //     tertiary: { dark: "#7ab3d9", default: "#7ab3d9", light: "#005882" },
            //     tertiary_container: { dark: "#1e3a52", default: "#1e3a52", light: "#7ab3d9" },
            //     tertiary_fixed: { dark: "#7ab3d9", default: "#7ab3d9", light: "#7ab3d9" },
            //     tertiary_fixed_dim: { dark: "#5499c2", default: "#5499c2", light: "#5499c2" }
            //   }
            // }
            //
            // After destructuring based on selected mode (dark/light), we extract the hex value:
            // {
            //   background: "#0f1512",  // extracted from obj[mode] or obj.default
            //   error: "#ba1a1a",
            //   error_container: "#93000a",
            //   inverse_on_surface: "#1a1c19",
            //   inverse_primary: "#006c4c",
            //   inverse_surface: "#1a1c19",
            //   on_background: "#e1e3de",
            //   on_error: "#ffffff",
            //   on_error_container: "#ffdad6",
            //   on_primary: "#003829",
            //   on_primary_container: "#00513c",
            //   on_primary_fixed: "#002114",
            //   on_primary_fixed_variant: "#00513c",
            //   on_secondary: "#1a3529",
            //   on_secondary_container: "#1e4d3a",
            //   on_secondary_fixed: "#002114",
            //   on_secondary_fixed_variant: "#1e4d3a",
            //   on_surface: "#e1e3de",
            //   on_surface_variant: "#c1c9c0",
            //   on_tertiary: "#1a2836",
            //   on_tertiary_container: "#1e3a52",
            //   on_tertiary_fixed: "#001e2e",
            //   on_tertiary_fixed_variant: "#1e3a52",
            //   outline: "#8b9389",
            //   outline_variant: "#414942",
            //   primary: "#4dd0a6",
            //   primary_container: "#00513c",
            //   primary_fixed: "#4dd0a6",
            //   primary_fixed_dim: "#2fb58a",
            //   scrim: "#000000",
            //   secondary: "#2fb58a",
            //   secondary_container: "#1e4d3a",
            //   secondary_fixed: "#2fb58a",
            //   secondary_fixed_dim: "#119a6f",
            //   shadow: "#000000",
            //   surface: "#111411",
            //   surface_bright: "#373a37",
            //   surface_container: "#1b1e1b",
            //   surface_container_high: "#252825",
            //   surface_container_highest: "#303330",
            //   surface_container_low: "#161916",
            //   surface_container_lowest: "#0c0f0c",
            //   surface_dim: "#111411",
            //   surface_variant: "#414942",
            //   tertiary: "#7ab3d9",
            //   tertiary_container: "#1e3a52",
            //   tertiary_fixed: "#7ab3d9",
            //   tertiary_fixed_dim: "#5499c2"
            // }
            //
            // This is then returned as MatugenColors type
            let colors = parsedResult.colors;

            const processedColors: Record<string, string> = {};
            for (const [key, value] of Object.entries(colors)) {
                if (typeof value === 'string') {
                    // Already a string, use it directly
                    processedColors[key] = value;
                } else if (typeof value === 'object' && value !== null) {
                    // Extract hex from mode-based color object
                    const obj = value as Record<string, unknown>;

                    // Check for mode-based colors (dark, default, light)
                    if (typeof obj[mode] === 'string') {
                        processedColors[key] = obj[mode] as string;
                    } else if (typeof obj.default === 'string') {
                        processedColors[key] = obj.default as string;
                    } else if (typeof obj.hex === 'string') {
                        processedColors[key] = obj.hex;
                    } else if (
                        typeof obj.r === 'number' &&
                        typeof obj.g === 'number' &&
                        typeof obj.b === 'number'
                    ) {
                        // Convert RGB to hex
                        const hex = `#${[obj.r, obj.g, obj.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
                        processedColors[key] = hex;
                    } else {
                        console.error(`[Matugen] Cannot extract hex from color object for ${key}:`, obj);
                        throw new Error(`Cannot extract hex color from object for ${key}`);
                    }
                } else {
                    console.error(`[Matugen] Unexpected color value type for ${key}: ${typeof value}`);
                    throw new Error(`Unexpected color value type for ${key}`);
                }
            }
            colors = processedColors;

            return colors as MatugenColors;
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

        // matugenColors must contain hex strings (e.g., primary: "#4dd0a6")
        // NOT objects (e.g., primary: { dark: "#4dd0a6", default: "#4dd0a6", light: "#006c4c" })
        // The destructuring happens in generateMatugenColors() before this is called
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
