import Pango from 'gi://Pango?version=1.0';

export type FontStyle = 'normal' | 'italic' | 'oblique';

const DEFAULT_FONT_STYLE: FontStyle = 'normal';

const styleMap: Record<Pango.Style, FontStyle> = {
    [Pango.Style.NORMAL]: 'normal',
    [Pango.Style.ITALIC]: 'italic',
    [Pango.Style.OBLIQUE]: 'oblique',
};

/**
 * Converts a Pango.Style enum to a FontStyle string.
 * @param styleEnum - The Pango.Style enum value.
 * @returns The corresponding FontStyle string.
 */
export function styleToString(styleEnum: Pango.Style): FontStyle {
    return styleMap[styleEnum] ?? DEFAULT_FONT_STYLE;
}
