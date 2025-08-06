import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.green),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.green),
    icon: opt(primaryColors.green),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
