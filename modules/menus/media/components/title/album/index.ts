const media = await Service.import('mpris');
import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';

export const songAlbum = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-song-album',
        hpack: 'center',
        children: [
            Widget.Label({
                truncate: 'end',
                wrap: true,
                max_width_chars: 40,
                class_name: 'media-indicator-current-song-album-label',
                setup: (self) => {
                    self.hook(media, () => {
                        const curPlayer = getPlayerInfo();
                        return (self.label =
                            curPlayer !== undefined && curPlayer['track_album'].length
                                ? curPlayer['track_album']
                                : '---');
                    });
                },
            }),
        ],
    });
};
