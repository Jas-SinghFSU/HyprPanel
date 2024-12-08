import { SongName } from './SongName';
import { SongAuthor } from './SongAuthor';
import { SongAlbum } from './SongAlbum';
import { Gtk } from 'astal/gtk3';

export const MediaInfo = (): JSX.Element => {
    return (
        <box className={'media-indicator-current-media-info'} halign={Gtk.Align.CENTER} hexpand vertical>
            <SongName />
            <SongAuthor />
            <SongAlbum />
        </box>
    );
};
