import { Opt } from 'lib/option';
import { Variable } from 'types/variable';
import { defaultColorMap } from './defaults/options';

export type MkOptionsResult = {
    configFile: string;
    array: () => Opt[];
    reset: () => Promise<string>;
    resetTheme: () => Promise<string>;
    handler: (deps: string[], callback: () => void) => void;
};

export type RecursiveOptionsObject = {
    [key: string]: RecursiveOptionsObject | Opt<string> | Opt<number> | Opt<boolean>;
};

export type BarLocation = 'top' | 'bottom';

export type Unit = 'imperial' | 'metric';
export type PowerOptions = 'sleep' | 'reboot' | 'logout' | 'shutdown';
export type NotificationAnchor =
    | 'top'
    | 'top right'
    | 'top left'
    | 'bottom'
    | 'bottom right'
    | 'bottom left'
    | 'left'
    | 'right';
export type OSDAnchor = 'top left' | 'top' | 'top right' | 'right' | 'bottom right' | 'bottom' | 'bottom left' | 'left';
export type BarButtonStyles = 'default' | 'split' | 'wave' | 'wave2';

export type ThemeExportData = {
    filePath: string;
    themeOnly: boolean;
};
export type RowProps<T> = {
    opt: Opt<T>;
    title: string;
    note?: string;
    type?:
        | 'number'
        | 'color'
        | 'float'
        | 'object'
        | 'string'
        | 'enum'
        | 'boolean'
        | 'img'
        | 'wallpaper'
        | 'export'
        | 'import'
        | 'config_import'
        | 'font';
    enums?: T[];
    max?: number;
    min?: number;
    disabledBinding?: Variable<boolean>;
    exportData?: ThemeExportData;
    subtitle?: string | VarType<string> | Opt;
    subtitleLink?: string;
    dependencies?: string[];
    increment?: number;
};

export type OSDOrientation = 'horizontal' | 'vertical';

export type HexColor = `#${string}`;

export type WindowLayer = 'top' | 'bottom' | 'overlay' | 'background';

export type ActiveWsIndicator = 'underline' | 'highlight' | 'color';

export type MatugenColors = {
    background: HexColor;
    error: HexColor;
    error_container: HexColor;
    inverse_on_surface: HexColor;
    inverse_primary: HexColor;
    inverse_surface: HexColor;
    on_background: HexColor;
    on_error: HexColor;
    on_error_container: HexColor;
    on_primary: HexColor;
    on_primary_container: HexColor;
    on_primary_fixed: HexColor;
    on_primary_fixed_variant: HexColor;
    on_secondary: HexColor;
    on_secondary_container: HexColor;
    on_secondary_fixed: HexColor;
    on_secondary_fixed_variant: HexColor;
    on_surface: HexColor;
    on_surface_variant: HexColor;
    on_tertiary: HexColor;
    on_tertiary_container: HexColor;
    on_tertiary_fixed: HexColor;
    on_tertiary_fixed_variant: HexColor;
    outline: HexColor;
    outline_variant: HexColor;
    primary: HexColor;
    primary_container: HexColor;
    primary_fixed: HexColor;
    primary_fixed_dim: HexColor;
    scrim: HexColor;
    secondary: HexColor;
    secondary_container: HexColor;
    secondary_fixed: HexColor;
    secondary_fixed_dim: HexColor;
    shadow: HexColor;
    surface: HexColor;
    surface_bright: HexColor;
    surface_container: HexColor;
    surface_container_high: HexColor;
    surface_container_highest: HexColor;
    surface_container_low: HexColor;
    surface_container_lowest: HexColor;
    surface_dim: HexColor;
    surface_variant: HexColor;
    tertiary: HexColor;
    tertiary_container: HexColor;
    tertiary_fixed: HexColor;
    tertiary_fixed_dim: HexColor;
};

export type MatugenVariation = {
    rosewater: HexColor;
    flamingo: HexColor;
    pink: HexColor;
    mauve: HexColor;
    red: HexColor;
    maroon: HexColor;
    peach: HexColor;
    yellow: HexColor;
    green: HexColor;
    teal: HexColor;
    sky: HexColor;
    sapphire: HexColor;
    blue: HexColor;
    lavender: HexColor;
    text: HexColor;
    subtext1: HexColor;
    subtext2: HexColor;
    overlay2: HexColor;
    overlay1: HexColor;
    overlay0: HexColor;
    surface2: HexColor;
    surface1: HexColor;
    surface0: HexColor;
    base2: HexColor;
    base: HexColor;
    mantle: HexColor;
    crust: HexColor;
    notifications_closer: HexColor;
    notifications_background: HexColor;
    dashboard_btn_text: HexColor;
    red2: HexColor;
    peach2: HexColor;
    pink2: HexColor;
    mantle2: HexColor;
    surface1_2: HexColor;
    surface0_2: HexColor;
    overlay1_2: HexColor;
    text2: HexColor;
    lavender2: HexColor;
    crust2: HexColor;
    maroon2: HexColor;
    mauve2: HexColor;
    green2: HexColor;
    surface2_2: HexColor;
    sky2: HexColor;
    teal2: HexColor;
    yellow2: HexColor;
    pink3: HexColor;
    red3: HexColor;
    mantle3: HexColor;
    surface0_3: HexColor;
    surface2_3: HexColor;
    overlay1_3: HexColor;
    lavender3: HexColor;
    mauve3: HexColor;
    green3: HexColor;
    sky3: HexColor;
    teal3: HexColor;
    yellow3: HexColor;
    maroon3: HexColor;
    crust3: HexColor;
    notifications_closer?: HexColor;
    notifications_background?: HexColor;
    dashboard_btn_text?: HexColor;
};
export type MatugenScheme =
    | 'content'
    | 'expressive'
    | 'fidelity'
    | 'fruit-salad'
    | 'monochrome'
    | 'neutral'
    | 'rainbow'
    | 'tonal-spot';

export type MatugenVariations =
    | 'standard_1'
    | 'standard_2'
    | 'standard_3'
    | 'monochrome_1'
    | 'monochrome_2'
    | 'monochrome_3'
    | 'vivid_1'
    | 'vivid_2'
    | 'vivid_3';

type MatugenTheme = 'light' | 'dark';

export type ColorMapKey = keyof typeof defaultColorMap;
export type ColorMapValue = (typeof defaultColorMap)[ColorMapKey];

export type ScalingPriority = 'gdk' | 'hyprland' | 'both';
