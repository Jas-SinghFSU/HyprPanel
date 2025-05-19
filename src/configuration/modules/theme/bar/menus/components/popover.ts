import { opt } from 'src/lib/options';
import { primaryColors, secondaryColors } from '../../../colors';

export default {
    scaling: opt(100),
    radius: opt('0.4em'),
    text: opt(primaryColors.lavender),
    background: opt(secondaryColors.mantle),
    border: opt(secondaryColors.mantle),
};
