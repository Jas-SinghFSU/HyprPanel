import { opt } from 'src/lib/options';
import { primaryColors } from '../colors/primary';
import { secondaryColors } from '../colors/secondary';
import { tertiaryColors } from '../colors/tertiary';

export default {
    scaling: opt(100),
    background: opt(tertiaryColors.mantle),
    opacity: opt(100),
    actions: {
        background: opt(secondaryColors.lavender),
        text: opt(primaryColors.mantle),
    },
    label: opt(primaryColors.lavender),
    border: opt(secondaryColors.surface0),
    border_radius: opt('0.6em'),
    enableShadow: opt(false),
    shadow: opt('0px 1px 2px 1px #16161e'),
    shadowMargins: opt('4px 4px'),
    time: opt(secondaryColors.overlay1),
    text: opt(primaryColors.text),
    labelicon: opt(primaryColors.lavender),
    close_button: {
        background: opt(secondaryColors.red),
        label: opt(primaryColors.crust),
    },
};
