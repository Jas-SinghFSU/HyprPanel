import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * FontButton component that extends Gtk.FontButton.
 *
 * @class FontButton
 * @extends {astalify(Gtk.FontButton)}
 */
class FontButton extends astalify(Gtk.FontButton) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of FontButton.
     * @param props - The properties for the FontButton component.
     * @memberof FontButton
     */
    constructor(props: ConstructProps<FontButton, Gtk.FontButton.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default FontButton;
