import { opt } from 'src/lib/options';
import { primaryColors, tertiaryColors } from '../../../colors';

export default {
    radius: opt('0.3em'),
    background: opt(primaryColors.crust),
    text: opt(tertiaryColors.lavender),
};
