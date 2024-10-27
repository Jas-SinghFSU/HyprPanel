import { BoxWidget } from 'lib/types/widget';
import { songName } from './name/index';
import { songAuthor } from './author/index';
import { songAlbum } from './album/index';

export const MediaInfo = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-media-info',
        hpack: 'center',
        hexpand: true,
        vertical: true,
        children: [songName(), songAuthor(), songAlbum()],
    });
};
