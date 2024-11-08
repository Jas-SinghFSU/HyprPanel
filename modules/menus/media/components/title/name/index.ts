import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';
import options from 'options';

const media = await Service.import('mpris');

const { noMediaText } = options.menus.media;

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
                    return Utils.merge([noMediaText.bind('value')], (noMediaTxt) => {
                        self.hook(media, () => {
                            const curPlayer = getPlayerInfo();
                            return (self.label =
                                curPlayer !== undefined && curPlayer['track_title'].length
                                    ? curPlayer['track_title']
                                    : noMediaTxt);
                        });
                    });
                },
            }),
        ],
    });
};
