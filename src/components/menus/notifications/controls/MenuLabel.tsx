import { Gtk } from 'astal/gtk3';

export const MenuLabel = (): JSX.Element => {
    return (
        <box className={'menu-label-container notifications'} halign={Gtk.Align.START} valign={Gtk.Align.CENTER} expand>
            <label className={'menu-label notifications'} label={'Notifications'} />
        </box>
    );
};
