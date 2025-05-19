import { opt } from 'src/lib/options';
import { SystrayIconMap } from 'src/lib/types/systray.types';

export default {
    ignore: opt<string[]>([]),
    customIcons: opt<SystrayIconMap>({}),
};
