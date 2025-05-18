import { opt } from '../../lib/options';
import { MatugenTheme, MatugenScheme, MatugenVariations } from '../../lib/options/options.types';

export const matugenOptions = {
    wall_type: opt<'static' | 'dynamic'>('static'),
    type: opt<'gtk' | 'colors'>('gtk'),
    gtk_palettes: opt(12),
    palette: opt(''),
    static_wallpaper: opt(''),
    mode: opt<MatugenTheme>('dark'),
    scheme_type: opt<MatugenScheme>('tonal-spot'),
    variation: opt<MatugenVariations>('standard_1'),
    contrast: opt(0.0),
};