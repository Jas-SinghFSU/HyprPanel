import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.sky),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.sky),
    icon: opt(primaryColors.sky),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
