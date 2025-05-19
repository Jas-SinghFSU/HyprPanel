import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors';

export default {
    foreground: opt(primaryColors.lavender),
    background: opt(primaryColors.surface1),
    radius: opt('0.3rem'),
};
