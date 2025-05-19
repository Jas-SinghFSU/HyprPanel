import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors';

export default {
    passive: opt(primaryColors.surface2),
    active: opt(primaryColors.lavender),
};
