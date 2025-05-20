import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    radius: opt('0.3em'),
    background: opt(primaryColors.crust),
    text: opt(tertiaryColors.lavender),
};
