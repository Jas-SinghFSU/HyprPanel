import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    border: opt(primaryColors.teal),
    background: opt(primaryColors.base2),
    text: opt(primaryColors.teal),
    icon: opt(primaryColors.teal),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.45em'),
};
