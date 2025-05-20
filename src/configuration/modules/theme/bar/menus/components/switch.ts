import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    enabled: opt(primaryColors.lavender),
    disabled: opt(tertiaryColors.surface0),
    puck: opt(secondaryColors.surface1),
    radius: opt('0.2em'),
    slider_radius: opt('0.2em'),
};
