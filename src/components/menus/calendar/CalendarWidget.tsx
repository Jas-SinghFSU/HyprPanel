import { Gtk } from 'astal/gtk3';
import Calendar from 'src/components/shared/Calendar';

export const CalendarWidget = (): JSX.Element => {
    return (
        <box className={'calendar-menu-item-container calendar'} halign={Gtk.Align.FILL} valign={Gtk.Align.FILL} expand>
            <box className={'calendar-container-box'}>
                <Calendar
                    className={'calendar-menu-widget'}
                    halign={Gtk.Align.FILL}
                    valign={Gtk.Align.FILL}
                    showDetails={false}
                    expand
                    showDayNames
                    showHeading
                />
            </box>
        </box>
    );
};
