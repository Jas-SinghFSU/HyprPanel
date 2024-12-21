import { Gtk } from 'astal/gtk3';
import { MilitaryTime } from './MilitaryTime';
import { StandardTime } from './StandardTime';

export const TimeWidget = (): JSX.Element => {
    return (
        <box className={'calendar-menu-item-container clock'} valign={Gtk.Align.CENTER} halign={Gtk.Align.FILL} hexpand>
            <box className={'clock-content-items'} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} hexpand>
                <StandardTime />
                <MilitaryTime />
            </box>
        </box>
    );
};
