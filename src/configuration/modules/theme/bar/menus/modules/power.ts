import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';

export default {
    scaling: opt(90),
    radius: opt('0.4em'),
    background: {
        color: opt(primaryColors.crust),
    },
    border: {
        color: opt(primaryColors.surface0),
    },
    buttons: {
        shutdown: {
            background: opt(primaryColors.base),
            icon_background: opt(secondaryColors.red),
            text: opt(primaryColors.red),
            icon: opt(secondaryColors.mantle),
        },
        restart: {
            background: opt(primaryColors.base),
            icon_background: opt(secondaryColors.peach),
            text: opt(primaryColors.peach),
            icon: opt(secondaryColors.mantle),
        },
        logout: {
            background: opt(primaryColors.base),
            icon_background: opt(secondaryColors.green),
            text: opt(primaryColors.green),
            icon: opt(secondaryColors.mantle),
        },
        sleep: {
            background: opt(primaryColors.base),
            icon_background: opt(secondaryColors.sky),
            text: opt(primaryColors.sky),
            icon: opt(secondaryColors.mantle),
        },
    },
};
