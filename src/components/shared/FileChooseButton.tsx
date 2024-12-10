import { Gtk, astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';

/**
 * FileChooserButton component that extends Gtk.FileChooserButton.
 *
 * @class FileChooserButton
 * @extends {astalify(Gtk.FileChooserButton)}
 */
class FileChooserButton extends astalify(Gtk.FileChooserButton) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of FileChooserButton.
     * @param props - The properties for the FileChooserButton component.
     * @memberof FileChooserButton
     */
    constructor(props: ConstructProps<FileChooserButton, Gtk.FileChooserButton.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }
}

export default FileChooserButton;
