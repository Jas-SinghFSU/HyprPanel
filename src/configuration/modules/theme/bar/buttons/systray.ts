import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';

export default {
    enableBorder: opt(false),
    customIcon: opt(primaryColors.text),
    border: opt(primaryColors.lavender),
    background: opt(primaryColors.base2),
    spacing: opt('0.5em'),
};
