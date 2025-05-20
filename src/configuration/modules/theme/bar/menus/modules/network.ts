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
        color: opt(primaryColors.mauve),
    },
    scroller: {
        color: opt(primaryColors.mauve),
    },
    text: opt(primaryColors.text),
    status: {
        color: opt(primaryColors.overlay0),
    },
    listitems: {
        passive: opt(primaryColors.text),
        active: opt(secondaryColors.mauve),
    },
    icons: {
        passive: opt(primaryColors.overlay2),
        active: opt(primaryColors.mauve),
    },
    iconbuttons: {
        passive: opt(primaryColors.text),
        active: opt(primaryColors.mauve),
    },
    switch: {
        enabled: opt(primaryColors.mauve),
        disabled: opt(tertiaryColors.surface0),
        puck: opt(secondaryColors.surface1),
    },
};
