import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * LevelBar component that extends Gtk.LevelBar.
 *
 * @class LevelBar
 * @extends {astalify(Gtk.LevelBar)}
 */
class LevelBar extends astalify(Gtk.LevelBar) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of LevelBar.
     * @param props - The properties for the LevelBar component.
     * @memberof LevelBar
     */
    constructor(props: ConstructProps<LevelBar, Gtk.LevelBar.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default LevelBar;
