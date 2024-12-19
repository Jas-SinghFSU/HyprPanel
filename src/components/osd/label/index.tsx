import { Gtk } from 'astal/gtk3';
import { setupOsdLabel } from './helpers';

export const OSDLabel = (): JSX.Element => {
    return (
        <box className={'osd-label-container'} hexpand vexpand>
            <label
                className={'osd-label'}
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                setup={setupOsdLabel}
                hexpand
                vexpand
            />
        </box>
    );
};
