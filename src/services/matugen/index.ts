import { ColorMapKey, HexColor, MatugenColors } from '../../lib/options/options.types';
import { getMatugenVariations } from './variations';
import { bash, dependencies, Notify, isAnImage } from '../../lib/utils';
import options from '../../options';
import icons from '../../lib/icons/icons';
import { defaultColorMap } from 'src/lib/types/defaults/options.types';

const MATUGEN_ENABLED = options.theme.matugen;
const MATUGEN_SETTINGS = options.theme.matugen_settings;

interface SystemDependencies {
    checkDependencies(dep: string): boolean;
    executeCommand(cmd: string): Promise<string>;
    notify(notification: { summary: string; body: string; iconName: string }): void;
    isValidImage(path: string): boolean;
}

class DefaultSystemDependencies implements SystemDependencies {
    public checkDependencies(dep: string): boolean {
        return dependencies(dep);
    }

    public async executeCommand(cmd: string): Promise<string> {
        return bash(cmd);
    }

    public notify(notification: { summary: string; body: string; iconName: string }): void {
        Notify(notification);
    }

    public isValidImage(path: string): boolean {
        return isAnImage(path);
    }
}

class MatugenService {
    private _deps: SystemDependencies;

    constructor(deps: SystemDependencies = new DefaultSystemDependencies()) {
        this._deps = deps;
    }

    private _normalizeContrast(contrast: number): number {
        return Math.max(-1, Math.min(1, contrast));
    }

    public async generateMatugenColors(): Promise<MatugenColors | undefined> {
        if (!MATUGEN_ENABLED.get() || !this._deps.checkDependencies('matugen')) {
            return;
        }

        const wallpaperPath = options.wallpaper.image.get();

        if (!wallpaperPath || !this._deps.isValidImage(wallpaperPath)) {
            this._deps.notify({
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

            const jsonResult = await this._deps.executeCommand(`${baseCommand} --dry-run --json hex`);
            await this._deps.executeCommand(baseCommand);

            const parsedResult = JSON.parse(jsonResult);
            return parsedResult?.colors?.[mode];
        } catch (error) {
            this._deps.notify({
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

const matugenService = new MatugenService();
export { matugenService };
