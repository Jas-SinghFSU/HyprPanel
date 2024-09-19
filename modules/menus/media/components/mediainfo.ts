import { BoxWidget } from 'lib/types/widget';
import { MprisPlayer } from 'types/service/mpris';

const media = await Service.import('mpris');

const MediaInfo = (getPlayerInfo: () => MprisPlayer): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-media-info',
        hpack: 'center',
        hexpand: true,
        vertical: true,
        children: [
            Widget.Box({
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
            }),
            Widget.Box({
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
            }),
            Widget.Box({
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
            }),
        ],
    });
};

export { MediaInfo };
