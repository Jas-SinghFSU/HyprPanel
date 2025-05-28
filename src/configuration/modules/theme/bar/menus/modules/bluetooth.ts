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
        color: opt(primaryColors.sky),
    },
    scroller: {
        color: opt(primaryColors.sky),
    },
    text: opt(primaryColors.text),
    status: opt(primaryColors.overlay0),
    switch_divider: opt(primaryColors.surface1),
    switch: {
        enabled: opt(primaryColors.sky),
        disabled: opt(tertiaryColors.surface0),
        puck: opt(secondaryColors.surface1),
    },
    listitems: {
        passive: opt(primaryColors.text),
        active: opt(secondaryColors.sky),
    },
    icons: {
        passive: opt(primaryColors.overlay2),
        active: opt(primaryColors.sky),
    },
    iconbutton: {
        passive: opt(primaryColors.text),
        active: opt(primaryColors.sky),
    },
};
