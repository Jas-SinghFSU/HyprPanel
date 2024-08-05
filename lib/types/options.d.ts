import { Opt } from "lib/option";
import { Variable } from "types/variable";

export type Unit = "imperial" | "metric";
export type PowerOptions = "sleep" | "reboot" | "logout" | "shutdown";
export type NotificationAnchor = "top" | "top right" | "top left" | "bottom" | "bottom right" | "bottom left";
export type OSDAnchor = "top left" | "top" | "top right" | "right" | "bottom right" | "bottom" | "bottom left" | "left";
export type RowProps<T> = {
    opt: Opt<T>
    title: string
    note?: string
    type?:
    | "number"
    | "color"
    | "float"
    | "object"
    | "string"
    | "enum"
    | "boolean"
    | "img"
    | "wallpaper"
    | "font"
    enums?: string[]
    max?: number
    min?: number
    disabledBinding?: Variable<boolean>
    subtitle?: string | VarType<any> | Opt,
    dependencies?: string[],
    increment?: number
}

export type OSDOrientation = "horizontal" | "vertical";

export type HexColor = `#${string}`;

export type MatugenColors = {
    "background": HexColor,
    "error": HexColor,
    "error_container": HexColor,
    "inverse_on_surface": HexColor,
    "inverse_primary": HexColor,
    "inverse_surface": HexColor,
    "on_background": HexColor,
    "on_error": HexColor,
    "on_error_container": HexColor,
    "on_primary": HexColor,
    "on_primary_container": HexColor,
    "on_primary_fixed": HexColor,
    "on_primary_fixed_variant": HexColor,
    "on_secondary": HexColor,
    "on_secondary_container": HexColor,
    "on_secondary_fixed": HexColor,
    "on_secondary_fixed_variant": HexColor,
    "on_surface": HexColor,
    "on_surface_variant": HexColor,
    "on_tertiary": HexColor,
    "on_tertiary_container": HexColor,
    "on_tertiary_fixed": HexColor,
    "on_tertiary_fixed_variant": HexColor,
    "outline": HexColor,
    "outline_variant": HexColor,
    "primary": HexColor,
    "primary_container": HexColor,
    "primary_fixed": HexColor,
    "primary_fixed_dim": HexColor,
    "scrim": HexColor,
    "secondary": HexColor,
    "secondary_container": HexColor,
    "secondary_fixed": HexColor,
    "secondary_fixed_dim": HexColor,
    "shadow": HexColor,
    "surface": HexColor,
    "surface_bright": HexColor,
    "surface_container": HexColor,
    "surface_container_high": HexColor,
    "surface_container_highest": HexColor,
    "surface_container_low": HexColor,
    "surface_container_lowest": HexColor,
    "surface_dim": HexColor,
    "surface_variant": HexColor,
    "tertiary": HexColor,
    "tertiary_container": HexColor,
    "tertiary_fixed": HexColor,
    "tertiary_fixed_dim": HexColor
}

type MatugenScheme =
    | "content"
    | "expressive"
    | "fidelity"
    | "fruit-salad"
    | "monochrome"
    | "neutral"
    | "rainbow"
    | "tonal-spot";

type MatugenVariation =
    | "standard_1"
    | "standard_2"
    | "standard_3"
    | "monochrome_1"
    | "monochrome_2"
    | "monochrome_3"
    | "vivid_1"
    | "vivid_2"
    | "vivid_3"

type MatugenTheme = "light" | "dark";
