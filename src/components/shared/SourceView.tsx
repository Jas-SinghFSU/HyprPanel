import { astalify, ConstructProps } from 'astal/gtk3';
import { GObject } from 'astal';
import GtkSource from 'gi://GtkSource?version=3.0';

/**
 * SourceView component that extends GtkSource.View.
 *
 * @class Window
 * @extends {astalify(GtkSource.View)}
 */
class SourceView extends astalify(GtkSource.View) {
    static {
        GObject.registerClass(this);
    }

    /**
     * Creates an instance of SourceView.
     * @param props - The properties for the SourceView component
     */
    constructor(props: ConstructProps<SourceView, GtkSource.View.ConstructorProps>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(props as any);
    }

    /**
     * Gets the GtkSource.Buffer associated with this view.
     * Overrides the base method to return the correct type.
     */
    public get_buffer(): GtkSource.Buffer {
        return super.get_buffer() as GtkSource.Buffer;
    }
}

export default SourceView;
