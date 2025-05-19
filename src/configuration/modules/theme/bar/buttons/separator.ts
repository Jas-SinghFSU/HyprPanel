import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors';

export default {
    color: opt(primaryColors.surface2),
    margins: opt('0.15em'),
    width: opt('0.1em'),
};
