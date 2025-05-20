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
        color: opt(primaryColors.maroon),
    },
    text: opt(primaryColors.text),
    scroller: {
        color: opt(primaryColors.maroon),
    },
    listitems: {
        passive: opt(primaryColors.text),
        active: opt(secondaryColors.maroon),
    },
    iconbutton: {
        passive: opt(primaryColors.text),
        active: opt(primaryColors.maroon),
    },
    icons: {
        passive: opt(primaryColors.overlay2),
        active: opt(primaryColors.maroon),
    },
    audio_slider: {
        primary: opt(primaryColors.maroon),
        background: opt(tertiaryColors.surface2),
        backgroundhover: opt(primaryColors.surface1),
        puck: opt(primaryColors.surface2),
    },
    input_slider: {
        primary: opt(primaryColors.maroon),
        background: opt(tertiaryColors.surface2),
        backgroundhover: opt(primaryColors.surface1),
        puck: opt(primaryColors.surface2),
    },
};
