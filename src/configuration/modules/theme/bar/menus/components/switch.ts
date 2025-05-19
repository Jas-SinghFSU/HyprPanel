import { opt } from 'src/lib/options';
import { primaryColors, tertiaryColors, secondaryColors } from '../../../colors';

export default {
    enabled: opt(primaryColors.lavender),
    disabled: opt(tertiaryColors.surface0),
    puck: opt(secondaryColors.surface1),
    radius: opt('0.2em'),
    slider_radius: opt('0.2em'),
};
