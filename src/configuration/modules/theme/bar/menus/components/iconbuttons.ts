import { opt } from 'src/lib/options';
import { secondaryColors, tertiaryColors } from '../../../colors';

export default {
    passive: opt(secondaryColors.text),
    active: opt(tertiaryColors.lavender),
};
