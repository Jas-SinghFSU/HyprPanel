import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.red),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.red),
    icon: opt(primaryColors.red),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.5em'),
};
