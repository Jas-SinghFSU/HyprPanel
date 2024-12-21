import options from 'src/options';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import { mediaAlbum } from 'src/globals/media';

const { hideAlbum } = options.menus.media;

export const SongAlbum = (): JSX.Element => {
    if (hideAlbum.get()) {
        return <box />;
    }

    return (
        <box className={'media-indicator-current-song-album'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-album-label'}
                label={bind(mediaAlbum)}
                maxWidthChars={40}
                truncate
                wrap
            />
        </box>
    );
};
