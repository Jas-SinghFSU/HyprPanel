import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

const { hideAuthor } = options.menus.media;

export const SongAuthor = (): JSX.Element => {
    if (hideAuthor.get()) {
        return <box />;
    }

    return (
        <box className={'media-indicator-current-song-author'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-author-label'}
                label={bind(mprisService, 'players').as((players) => {
                    const currentPlayer = players[0];

                    if (currentPlayer !== undefined && currentPlayer.artist.length) {
                        return currentPlayer.artist;
                    }
                    return '-----';
                })}
                maxWidthChars={35}
                truncate
                wrap
            />
        </box>
    );
};
