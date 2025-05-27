import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.peach),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.peach),
    icon: opt(primaryColors.peach),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
