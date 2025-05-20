import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    background: opt(primaryColors.base2),
    enableBorder: opt(false),
    border: opt(primaryColors.yellow),
    icon: opt(primaryColors.yellow),
    spacing: opt('0.5em'),
};
