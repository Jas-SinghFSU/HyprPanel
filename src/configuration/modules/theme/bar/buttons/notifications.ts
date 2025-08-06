import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.lavender),
    background: opt(primaryColors.base2),
    icon: opt(primaryColors.lavender),
    icon_background: opt(primaryColors.base2),
    total: opt(primaryColors.lavender),
    spacing: opt('0.5em'),
};
