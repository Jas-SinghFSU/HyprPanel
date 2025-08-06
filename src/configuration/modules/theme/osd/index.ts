import { opt } from 'src/lib/options';
import { OSDOrientation, OSDAnchor } from 'src/lib/options/types';
import { primaryColors } from '../colors/primary';
import { secondaryColors } from '../colors/secondary';
import { tertiaryColors } from '../colors/tertiary';

export default {
    scaling: opt(100),
    duration: opt(2500),
    enable: opt(true),
    orientation: opt<OSDOrientation>('vertical'),
    opacity: opt(100),
    border: {
        size: opt('0em'),
        color: opt(primaryColors.lavender),
    },
    bar_container: opt(primaryColors.crust),
    icon_container: opt(tertiaryColors.lavender),
    bar_color: opt(tertiaryColors.lavender),
    bar_empty_color: opt(primaryColors.surface0),
    bar_overflow_color: opt(secondaryColors.red),
    icon: opt(primaryColors.crust),
    label: opt(tertiaryColors.lavender),
    monitor: opt(0),
    active_monitor: opt(true),
    radius: opt('0.4em'),
    margins: opt('7px 7px 7px 7px'),
    enableShadow: opt(false),
    shadow: opt('0px 0px 3px 2px #16161e'),
    location: opt<OSDAnchor>('right'),
    muted_zero: opt(false),
};
