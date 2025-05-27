import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    default: opt(primaryColors.lavender),
    active: opt(secondaryColors.pink),
    disabled: opt(tertiaryColors.surface2),
    text: opt(secondaryColors.mantle),
    radius: opt('0.4em'),
};
