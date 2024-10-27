import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';

const media = await Service.import('mpris');

export const songName = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-song-name',
        hpack: 'center',
        children: [
            Widget.Label({
                truncate: 'end',
                max_width_chars: 31,
                wrap: true,
                class_name: 'media-indicator-current-song-name-label',
                setup: (self) => {
                    self.hook(media, () => {
                        const curPlayer = getPlayerInfo();
                        return (self.label =
                            curPlayer !== undefined && curPlayer['track_title'].length
                                ? curPlayer['track_title']
                                : 'No Media Currently Playing');
                    });
                },
            }),
        ],
    });
};
