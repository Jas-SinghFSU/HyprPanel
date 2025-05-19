import { opt } from 'src/lib/options';
import { primaryColors, secondaryColors, tertiaryColors } from '../../../colors';

export default {
    default: opt(primaryColors.lavender),
    active: opt(secondaryColors.pink),
    disabled: opt(tertiaryColors.surface2),
    text: opt(secondaryColors.mantle),
    radius: opt('0.4em'),
};
