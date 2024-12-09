import { Gtk } from 'astal/gtk3';
import { setupOsdIcon } from './helpers';

export const OSDIcon = (): JSX.Element => {
    return (
        <box className={'osd-icon-container'} hexpand>
            <label
                className={'osd-icon txt-icon'}
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                setup={setupOsdIcon}
                expand
            />
        </box>
    );
};
