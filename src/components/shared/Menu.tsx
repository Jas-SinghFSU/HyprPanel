import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * Menu component that extends Gtk.Menu.
 *
 * @class Menu
 * @extends {astalify(Gtk.Menu)}
 */
class Menu extends astalify(Gtk.Menu) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Menu.
     * @param props - The properties for the Menu component.
     * @memberof Menu
     */
    constructor(props: ConstructProps<Menu, Gtk.Menu.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default Menu;
