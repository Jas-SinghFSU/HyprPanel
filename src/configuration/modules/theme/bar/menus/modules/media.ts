import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    scaling: opt(100),
    song: opt(tertiaryColors.lavender),
    artist: opt(tertiaryColors.teal),
    album: opt(tertiaryColors.pink),
    timestamp: opt(primaryColors.text),
    background: {
        color: opt(primaryColors.crust),
    },
    card: {
        color: opt(primaryColors.base),
        tint: opt(85),
    },
    border: {
        color: opt(primaryColors.surface0),
    },
    buttons: {
        inactive: opt(primaryColors.surface2),
        enabled: opt(secondaryColors.teal),
        background: opt(tertiaryColors.lavender),
        text: opt(primaryColors.crust),
    },
    slider: {
        primary: opt(primaryColors.pink),
        background: opt(tertiaryColors.surface2),
        backgroundhover: opt(primaryColors.surface1),
        puck: opt(primaryColors.overlay0),
    },
};
