import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * Window component that extends Gtk.Window.
 *
 * @class Window
 * @extends {astalify(Gtk.Window)}
 */
class RegularWindow extends astalify(Gtk.Window) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of Window.
     * @param props - The properties for the Window component.
     * @memberof Window
     */
    constructor(props: ConstructProps<RegularWindow, Gtk.Window.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default RegularWindow;
