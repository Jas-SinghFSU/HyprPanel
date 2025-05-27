import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.mauve),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.mauve),
    icon: opt(primaryColors.mauve),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
