import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';

export default {
    passive: opt(primaryColors.text),
    active: opt(secondaryColors.lavender),
};
