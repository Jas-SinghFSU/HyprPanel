import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';

export default {
    background: opt(primaryColors.crust),
    text: opt(primaryColors.text),
    divider: opt(primaryColors.base),
};
