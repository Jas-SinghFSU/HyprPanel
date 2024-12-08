import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import { notifdService } from 'src/lib/constants/services';

export const Placeholder = (): JSX.Element => {
    return (
        <box className={'notification-label-container'} halign={Gtk.Align.CENTER} valign={Gtk.Align.FILL} expand>
            <box valign={Gtk.Align.CENTER} vertical expand>
                <label
                    className={'placeholder-label dim bell txt-icon'}
                    label={bind(notifdService, 'dontDisturb').as((dnd) => (dnd ? '󰂛' : '󰂚'))}
                    valign={Gtk.Align.CENTER}
                />
                <label
                    className={'placeholder-label dim message'}
                    label={"You're all caught up :)"}
                    valign={Gtk.Align.START}
                />
            </box>
        </box>
    );
};
