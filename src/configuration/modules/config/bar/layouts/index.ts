import { opt } from 'src/lib/options';
import { BarLayouts } from 'src/lib/options/types';

export default opt<BarLayouts>({
    '1': {
        left: ['dashboard', 'workspaces', 'windowtitle'],
        middle: ['media'],
        right: ['volume', 'clock', 'notifications'],
    },
    '2': {
        left: ['dashboard', 'workspaces', 'windowtitle'],
        middle: ['media'],
        right: ['volume', 'clock', 'notifications'],
    },
    '0': {
        left: ['dashboard', 'workspaces', 'windowtitle'],
        middle: ['media'],
        right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
    },
});
