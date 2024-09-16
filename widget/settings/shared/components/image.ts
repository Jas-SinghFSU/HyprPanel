import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';

export const imageInputter = <T>(self: BoxWidget, opt: Opt<T>): Attribute => {
    return (self.child = Widget.FileChooserButton({
        class_name: 'image-chooser',
        on_file_set: ({ uri }) => {
            opt.value = uri!.replace('file://', '') as T;
        },
    }));
};
