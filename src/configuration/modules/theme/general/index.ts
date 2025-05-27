import { FontStyle } from 'src/components/settings/shared/inputs/font/utils';
import { opt } from 'src/lib/options';
import { MatugenTheme, MatugenScheme, MatugenVariations } from 'src/lib/options/types';

export default {
    tooltip: {
        scaling: opt(100),
    },
    matugen: opt(false),
    matugen_settings: {
        mode: opt<MatugenTheme>('dark'),
        scheme_type: opt<MatugenScheme>('tonal-spot'),
        variation: opt<MatugenVariations>('standard_1'),
        contrast: opt(0.0),
    },
    font: {
        size: opt('1.2rem'),
        name: opt('Ubuntu Nerd Font'),
        style: opt<FontStyle>('normal'),
        label: opt('Ubuntu Nerd Font'),
        weight: opt(600),
    },
};
