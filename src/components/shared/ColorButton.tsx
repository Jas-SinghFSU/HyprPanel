import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * ColorButton component that extends Gtk.ColorButton.
 *
 * @class ColorButton
 * @extends {astalify(Gtk.ColorButton)}
 */
class ColorButton extends astalify(Gtk.ColorButton) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of ColorButton.
     * @param props - The properties for the ColorButton component.
     * @memberof ColorButton
     */
    constructor(props: ConstructProps<ColorButton, Gtk.ColorButton.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default ColorButton;
