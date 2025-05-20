import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.red),
    background: opt(primaryColors.base2),
    icon: opt(primaryColors.red),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
