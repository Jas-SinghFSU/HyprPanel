import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * SpinButton component that extends Gtk.SpinButton.
 *
 * @class SpinButton
 * @extends {astalify(Gtk.SpinButton)}
 */
class SpinButton extends astalify(Gtk.SpinButton) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of SpinButton.
     * @param props - The properties for the SpinButton component.
     * @memberof SpinButton
     */
    constructor(props: ConstructProps<SpinButton, Gtk.SpinButton.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default SpinButton;
