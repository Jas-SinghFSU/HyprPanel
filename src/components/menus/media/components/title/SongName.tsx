import { Gtk } from 'astal/gtk3';
import options from 'src/options';
import { bind, Variable } from 'astal';
import { mprisService } from 'src/lib/constants/services';

const { noMediaText } = options.menus.media;
export const SongName = (): JSX.Element => {
    return (
        <box className={'media-indicator-current-song-name'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-name-label'}
                label={Variable.derive([bind(noMediaText), bind(mprisService, 'players')], (noMediaTxt, players) => {
                    const currentPlayer = players[0];

                    if (currentPlayer !== undefined && currentPlayer.title.length) {
                        return currentPlayer.title;
                    }

                    return noMediaTxt;
                })()}
                maxWidthChars={31}
                truncate
                wrap
            />
        </box>
    );
};
