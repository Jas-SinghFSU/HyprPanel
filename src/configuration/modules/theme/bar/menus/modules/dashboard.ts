import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';
import { tertiaryColors } from '../../../colors/tertiary';

export default {
    scaling: opt(100),
    confirmation_scaling: opt(100),
    card: {
        color: opt(primaryColors.base),
    },
    background: {
        color: opt(primaryColors.crust),
    },
    border: {
        color: opt(primaryColors.surface0),
    },
    profile: {
        name: opt(primaryColors.pink),
        size: opt('8.5em'),
        radius: opt('0.4em'),
    },
    powermenu: {
        shutdown: opt(primaryColors.red),
        restart: opt(primaryColors.peach),
        logout: opt(primaryColors.green),
        sleep: opt(primaryColors.sky),
        confirmation: {
            card: opt(primaryColors.base),
            background: opt(primaryColors.crust),
            border: opt(primaryColors.surface0),
            label: opt(primaryColors.lavender),
            body: opt(primaryColors.text),
            confirm: opt(primaryColors.green),
            deny: opt(primaryColors.red),
            button_text: opt(secondaryColors.crust),
        },
    },
    shortcuts: {
        background: opt(primaryColors.lavender),
        text: opt(secondaryColors.mantle),
        recording: opt(primaryColors.green),
    },
    controls: {
        disabled: opt(primaryColors.surface2),
        wifi: {
            background: opt(primaryColors.mauve),
            text: opt(secondaryColors.mantle),
        },
        bluetooth: {
            background: opt(primaryColors.sky),
            text: opt(secondaryColors.mantle),
        },
        notifications: {
            background: opt(primaryColors.yellow),
            text: opt(secondaryColors.mantle),
        },
        volume: {
            background: opt(primaryColors.maroon),
            text: opt(secondaryColors.mantle),
        },
        input: {
            background: opt(primaryColors.pink),
            text: opt(secondaryColors.mantle),
        },
    },
    directories: {
        left: {
            top: {
                color: opt(primaryColors.pink),
            },
            middle: {
                color: opt(primaryColors.yellow),
            },
            bottom: {
                color: opt(primaryColors.maroon),
            },
        },
        right: {
            top: {
                color: opt(primaryColors.teal),
            },
            middle: {
                color: opt(primaryColors.mauve),
            },
            bottom: {
                color: opt(primaryColors.lavender),
            },
        },
    },
    monitors: {
        bar_background: opt(primaryColors.surface1),
        cpu: {
            icon: opt(primaryColors.maroon),
            bar: opt(tertiaryColors.maroon),
            label: opt(primaryColors.maroon),
        },
        ram: {
            icon: opt(primaryColors.yellow),
            bar: opt(tertiaryColors.yellow),
            label: opt(primaryColors.yellow),
        },
        gpu: {
            icon: opt(primaryColors.green),
            bar: opt(tertiaryColors.green),
            label: opt(primaryColors.green),
        },
        disk: {
            icon: opt(primaryColors.pink),
            bar: opt(tertiaryColors.pink),
            label: opt(primaryColors.pink),
        },
    },
};
