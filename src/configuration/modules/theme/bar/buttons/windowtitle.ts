import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    background: opt(primaryColors.base2),
    enableBorder: opt(false),
    border: opt(primaryColors.pink),
    text: opt(primaryColors.pink),
    icon: opt(primaryColors.pink),
    icon_background: opt(primaryColors.base2),
    spacing: opt('0.5em'),
};
