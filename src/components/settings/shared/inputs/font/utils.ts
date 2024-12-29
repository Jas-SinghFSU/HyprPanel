import Pango from 'gi://Pango?version=1.0';

export type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontVariant = 'normal' | 'small-caps';
export type FontWeight =
    | 'thin'
    | 'ultralight'
    | 'light'
    | 'semilight'
    | 'book'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'ultrabold'
    | 'heavy';

const DEFAULT_FONT_STYLE: FontStyle = 'normal';
const DEFAULT_FONT_VARIANT: FontVariant = 'normal';
const DEFAULT_FONT_WEIGHT: FontWeight = 'normal';

const styleMap: Record<Pango.Style, FontStyle> = {
    [Pango.Style.NORMAL]: 'normal',
    [Pango.Style.ITALIC]: 'italic',
    [Pango.Style.OBLIQUE]: 'oblique',
};

const variantMap: Record<Pango.Variant, FontVariant> = {
    [Pango.Variant.NORMAL]: 'normal',
    [Pango.Variant.SMALL_CAPS]: 'small-caps',
};

const weightMap: Record<Pango.Weight, FontWeight> = {
    [Pango.Weight.THIN]: 'thin',
    [Pango.Weight.ULTRALIGHT]: 'ultralight',
    [Pango.Weight.LIGHT]: 'light',
    [Pango.Weight.SEMILIGHT]: 'semilight',
    [Pango.Weight.BOOK]: 'book',
    [Pango.Weight.NORMAL]: 'normal',
    [Pango.Weight.MEDIUM]: 'medium',
    [Pango.Weight.SEMIBOLD]: 'semibold',
    [Pango.Weight.BOLD]: 'bold',
    [Pango.Weight.ULTRABOLD]: 'ultrabold',
    [Pango.Weight.HEAVY]: 'heavy',
};

/**
 * Converts a Pango.Style enum to a FontStyle string.
 * @param styleEnum - The Pango.Style enum value.
 * @returns The corresponding FontStyle string.
 */
export function styleToString(styleEnum: Pango.Style): FontStyle {
    return styleMap[styleEnum] ?? DEFAULT_FONT_STYLE;
}

/**
 * Converts a Pango.Variant enum to a FontVariant string.
 * @param variantEnum - The Pango.Variant enum value.
 * @returns The corresponding FontVariant string.
 */
export function variantToString(variantEnum: Pango.Variant): FontVariant {
    return variantMap[variantEnum] ?? DEFAULT_FONT_VARIANT;
}

/**
 * Converts a Pango.Weight enum to a FontWeight string.
 * @param weightEnum - The Pango.Weight enum value.
 * @returns The corresponding FontWeight string.
 */
export function weightToString(weightEnum: Pango.Weight): FontWeight {
    return weightMap[weightEnum] ?? DEFAULT_FONT_WEIGHT;
}
