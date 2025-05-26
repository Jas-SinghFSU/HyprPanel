import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * TextView component that extends Gtk.TextView.
 *
 * @class TextView
 * @extends {astalify(Gtk.TextView)}
 */
class TextView extends astalify(Gtk.TextView) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of TextView.
     * @param props - The properties for the TextView component.
     * @memberof TextView
     */
    constructor(props: ConstructProps<TextView, Gtk.TextView.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default TextView;
