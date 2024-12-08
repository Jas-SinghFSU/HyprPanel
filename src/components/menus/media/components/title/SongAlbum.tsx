import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

const { hideAlbum } = options.menus.media;

export const SongAlbum = (): JSX.Element => {
    if (hideAlbum.get()) {
        return <box />;
    }

    return (
        <box className={'media-indicator-current-song-album'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-album-label'}
                label={bind(mprisService.players[0], 'album').as((album) => {
                    const currentPlayer = mprisService.players[0];

                    if (currentPlayer !== undefined && album.length) {
                        return album;
                    }
                    return '-----';
                })}
                maxWidthChars={40}
                truncate
                wrap
            />
        </box>
    );
};
