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
                label={bind(mprisService, 'players').as((players) => {
                    const currentPlayer = players[0];

                    if (currentPlayer !== undefined && currentPlayer.album.length) {
                        return currentPlayer.album;
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
