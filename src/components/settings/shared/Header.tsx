import { Gtk } from 'astal/gtk3';
import Separator from 'src/components/shared/Separator';

export const Header = ({ title }: HeaderProps): JSX.Element => {
    return (
        <box className="options-header">
            <label className="label-name" label={title} />
            <Separator className="menu-separator" valign={Gtk.Align.CENTER} hexpand />
        </box>
    );
};

interface HeaderProps {
    title: string;
}
