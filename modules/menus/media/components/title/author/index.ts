const media = await Service.import('mpris');
import { BoxWidget } from 'lib/types/widget';
import { getPlayerInfo } from '../../helpers';

export const songAuthor = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-song-author',
        hpack: 'center',
        children: [
            Widget.Label({
                truncate: 'end',
                wrap: true,
                max_width_chars: 35,
                class_name: 'media-indicator-current-song-author-label',
                setup: (self) => {
                    self.hook(media, () => {
                        const curPlayer = getPlayerInfo();

                        const makeArtistList = (trackArtists: string[]): string => {
                            if (trackArtists.length === 1 && !trackArtists[0].length) {
                                return '-----';
                            }

                            return trackArtists.join(', ');
                        };

                        return (self.label =
                            curPlayer !== undefined && curPlayer['track_artists'].length
                                ? makeArtistList(curPlayer['track_artists'])
                                : '-----');
                    });
                },
            }),
        ],
    });
};
