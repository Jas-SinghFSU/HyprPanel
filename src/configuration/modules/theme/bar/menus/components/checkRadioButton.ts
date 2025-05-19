import { opt } from 'src/lib/options';
import { primaryColors, tertiaryColors } from '../../../colors';

export default {
    background: opt(primaryColors.surface1),
    active: opt(tertiaryColors.lavender),
};
