import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * Spinner component that extends Gtk.Spinner.
 *
 * @class Spinner
 * @extends {astalify(Gtk.Spinner)}
 */
class Spinner extends astalify(Gtk.Spinner) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Spinner.
     * @param props - The properties for the Spinner component.
     * @memberof Spinner
     */
    constructor(props: ConstructProps<Spinner, Gtk.Spinner.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default Spinner;
