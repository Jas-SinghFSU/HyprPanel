import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.maroon),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.maroon),
    icon: opt(primaryColors.maroon),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.5em'),
};
