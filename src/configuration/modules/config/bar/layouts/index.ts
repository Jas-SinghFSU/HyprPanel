import { opt } from 'src/lib/options';
import { BarLayouts } from 'src/lib/options/types';

export default opt<BarLayouts>({
    '1': {
        left: ['dashboard'],
        middle: [],
        right: ['volume', 'clock'],
    },
    '2': {
        left: ['dashboard'],
        middle: [],
        right: ['volume', 'clock'],
    },
    '0': {
        left: ['dashboard'],
        middle: [],
        right: ['volume', 'clock'],
    },
});
