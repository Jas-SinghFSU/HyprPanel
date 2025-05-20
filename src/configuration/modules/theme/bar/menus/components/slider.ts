import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    primary: opt(primaryColors.lavender),
    background: opt(tertiaryColors.surface2),
    backgroundhover: opt(primaryColors.surface1),
    puck: opt(primaryColors.overlay0),
    slider_radius: opt('0.3rem'),
    progress_radius: opt('0.3rem'),
};
