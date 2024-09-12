import { Opt } from 'lib/option';
import { Attribute, GtkWidget } from 'lib/types/widget';
import Box from 'types/widgets/box';

export const imageInputter = <T>(self: Box<GtkWidget, Attribute>, opt: Opt<T>): Attribute => {
    return (self.child = Widget.FileChooserButton({
        class_name: 'image-chooser',
        on_file_set: ({ uri }) => {
            opt.value = uri!.replace('file://', '') as T;
        },
    }));
};
