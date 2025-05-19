import { opt } from 'src/lib/options';
import { primaryColors, secondaryColors } from '../../../colors';

export default {
    passive: opt(primaryColors.text),
    active: opt(secondaryColors.lavender),
};
