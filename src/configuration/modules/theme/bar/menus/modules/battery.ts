import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    scaling: opt(100),
    card: {
        color: opt(primaryColors.base),
    },
    background: {
        color: opt(primaryColors.crust),
    },
    border: {
        color: opt(primaryColors.surface0),
    },
    label: {
        color: opt(primaryColors.yellow),
    },
    text: opt(primaryColors.text),
    listitems: {
        passive: opt(secondaryColors.text),
        active: opt(primaryColors.yellow),
    },
    icons: {
        passive: opt(primaryColors.overlay2),
        active: opt(primaryColors.yellow),
    },
    slider: {
        primary: opt(primaryColors.yellow),
        background: opt(tertiaryColors.surface2),
        backgroundhover: opt(primaryColors.surface1),
        puck: opt(primaryColors.overlay0),
    },
};
