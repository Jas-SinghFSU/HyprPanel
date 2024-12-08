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
                label={bind(mprisService.players[0], 'artist').as((artist) => {
                    const currentPlayer = mprisService.players[0];

                    if (currentPlayer !== undefined && artist.length) {
                        return artist;
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
