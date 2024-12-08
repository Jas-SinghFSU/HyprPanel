import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * Separator component that extends Gtk.Separator.
 *
 * @class Separator
 * @extends {astalify(Gtk.Separator)}
 */
class Separator extends astalify(Gtk.Separator) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Separator.
     * @param props - The properties for the Separator component.
     * @memberof Separator
     */
    constructor(props: ConstructProps<Separator, Gtk.Separator.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default Separator;
