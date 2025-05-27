import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    scaling: opt(100),
    height: opt('58em'),
    label: opt(primaryColors.lavender),
    no_notifications_label: opt(primaryColors.surface0),
    background: opt(primaryColors.crust),
    card: opt(primaryColors.base),
    border: opt(primaryColors.surface0),
    switch_divider: opt(primaryColors.surface1),
    clear: opt(primaryColors.red),
    switch: {
        enabled: opt(primaryColors.lavender),
        disabled: opt(tertiaryColors.surface0),
        puck: opt(secondaryColors.surface1),
    },
    pager: {
        show: opt(true),
        background: opt(primaryColors.crust),
        button: opt(primaryColors.lavender),
        label: opt(primaryColors.overlay2),
    },
    scrollbar: {
        color: opt(primaryColors.lavender),
        width: opt('0.35em'),
        radius: opt('0.2em'),
    },
};
