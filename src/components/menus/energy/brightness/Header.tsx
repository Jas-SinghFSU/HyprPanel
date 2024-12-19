import { Gtk } from 'astal/gtk3';

export const BrightnessHeader = (): JSX.Element => {
    return (
        <box className={'menu-label-container'} halign={Gtk.Align.FILL}>
            <label className={'menu-label'} halign={Gtk.Align.START} label={'Brightness'} hexpand />
        </box>
    );
};
