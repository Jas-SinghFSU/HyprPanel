import { Gtk } from 'astal/gtk3';
import { Controls } from './Controls';

export const Header = (): JSX.Element => {
    const MenuLabel = (): JSX.Element => {
        return <label className="menu-label" valign={Gtk.Align.CENTER} halign={Gtk.Align.START} label="Bluetooth" />;
    };

    return (
        <box className="menu-label-container" halign={Gtk.Align.FILL} valign={Gtk.Align.START}>
            <MenuLabel />
            <Controls />
        </box>
    );
};
