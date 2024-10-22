import { Opt } from 'lib/option';
import { Attribute, BoxWidget, Child } from 'lib/types/widget';
import FileChooserButton from 'types/widgets/filechooserbutton';

export const imageInputter = <T>(self: BoxWidget, opt: Opt<T>): Attribute => {
    self.child = createFileChooserButton(opt);
    return self.child;
};

const createFileChooserButton = <T>(opt: Opt<T>): FileChooserButton<Child, Attribute> => {
    return Widget.FileChooserButton({
        class_name: 'image-chooser',
        on_file_set: handleFileSet(opt),
    });
};

const handleFileSet =
    <T>(opt: Opt<T>) =>
    ({ uri }: { uri: string | null }): void => {
        if (!uri) {
            console.warn('No URI selected');
            return;
        }

        try {
            const decodedPath = decodeURIComponent(uri.replace('file://', ''));
            opt.value = decodedPath as T;
        } catch (error) {
            console.error('Failed to decode URI:', error);
        }
    };
