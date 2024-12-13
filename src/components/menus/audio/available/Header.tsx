import { Gtk } from 'astal/gtk3';

export const Header = ({ type, label }: HeaderProps): JSX.Element => {
    return (
        <box className={`menu-label-container ${type}`} halign={Gtk.Align.FILL}>
            <label className={`menu-label audio ${type}`} halign={Gtk.Align.START} hexpand label={label} />
        </box>
    );
};

interface HeaderProps {
    type: 'playback' | 'input';
    label: string;
}
