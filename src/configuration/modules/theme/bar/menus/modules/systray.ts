import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors';

export default {
    dropdownmenu: {
        background: opt(primaryColors.crust),
        text: opt(primaryColors.text),
        divider: opt(primaryColors.base),
    },
};
