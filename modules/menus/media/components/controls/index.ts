import { BoxWidget } from 'lib/types/widget.js';
import { shuffleControl } from './shuffle/index.js';
import { previousTrack } from './previous/index.js';
import { playPause } from './playpause/index.js';
import { nextTrack } from './next/index.js';
import { loopControl } from './loop/index.js';

const Controls = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-player-controls',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'media-indicator-current-controls',
                hpack: 'center',
                children: [shuffleControl(), previousTrack(), playPause(), nextTrack(), loopControl()],
            }),
        ],
    });
};

export { Controls };
