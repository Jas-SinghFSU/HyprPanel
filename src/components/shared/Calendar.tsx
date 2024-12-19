import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * Calendar component that extends Gtk.Calendar.
 *
 * @class Calendar
 * @extends {astalify(Gtk.Calendar)}
 */
class Calendar extends astalify(Gtk.Calendar) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Calendar.
     * @param props - The properties for the Calendar component.
     * @memberof Calendar
     */
    constructor(props: ConstructProps<Calendar, Gtk.Calendar.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default Calendar;
