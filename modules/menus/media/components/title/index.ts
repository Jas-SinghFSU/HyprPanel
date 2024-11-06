import { BoxWidget } from 'lib/types/widget';
import { songName } from './name/index';
import { songAuthor } from './author/index';
import { songAlbum } from './album/index';
import options from 'options';

const { hideAlbum, hideAuthor } = options.menus.media;

export const MediaInfo = (): BoxWidget => {
    return Widget.Box({
        class_name: 'media-indicator-current-media-info',
        hpack: 'center',
        hexpand: true,
        vertical: true,
        children: Utils.merge([hideAlbum.bind('value'), hideAuthor.bind('value')], (hidAlbum, hidAuthor) => {
            return [songName(), ...(hidAuthor ? [] : [songAuthor()]), ...(hidAlbum ? [] : [songAlbum()])];
        }),
    });
};
