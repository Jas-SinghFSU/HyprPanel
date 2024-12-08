import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import { mediaTitle } from 'src/globals/media';

export const SongName = (): JSX.Element => {
    return (
        <box className={'media-indicator-current-song-name'} halign={Gtk.Align.CENTER}>
            <label
                className={'media-indicator-current-song-name-label'}
                label={bind(mediaTitle)}
                maxWidthChars={31}
                truncate
                wrap
            />
        </box>
    );
};
