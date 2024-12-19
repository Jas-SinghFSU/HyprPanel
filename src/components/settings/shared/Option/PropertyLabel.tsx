import { Gtk } from 'astal/gtk3';
import { Label } from '../Label';

export const PropertyLabel = ({ title, subtitle, subtitleLink }: PropertyLabelProps): JSX.Element => {
    return (
        <box halign={Gtk.Align.START} valign={Gtk.Align.CENTER} hexpand>
            <Label title={title} subtitle={subtitle} subtitleLink={subtitleLink} />
        </box>
    );
};

interface PropertyLabelProps {
    title: string;
    subtitle?: string;
    subtitleLink?: string;
}
