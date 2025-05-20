import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    background: opt(primaryColors.surface1),
    active: opt(tertiaryColors.lavender),
};
