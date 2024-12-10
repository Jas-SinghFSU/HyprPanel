import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * MenuItem component that extends Gtk.MenuItem.
 *
 * @class MenuItem
 * @extends {astalify(Gtk.MenuItem)}
 */
class MenuItem extends astalify(Gtk.MenuItem) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of MenuItem.
     * @param props - The properties for the MenuItem component.
     * @memberof MenuItem
     */
    constructor(props: ConstructProps<MenuItem, Gtk.MenuItem.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default MenuItem;
