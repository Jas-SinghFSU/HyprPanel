import { Gtk } from 'astal/gtk3';
import { Label, LabelSettingProps } from '../Label';

export const PropertyLabel = ({ title, subtitle, subtitleLink }: LabelSettingProps): JSX.Element => {
    return (
        <box halign={Gtk.Align.START} valign={Gtk.Align.START} hexpand>
            <Label title={title} subtitle={subtitle} subtitleLink={subtitleLink} />
        </box>
    );
};
