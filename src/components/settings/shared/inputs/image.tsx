import { Gtk } from 'astal/gtk3';
import FileChooserButton from 'src/components/shared/FileChooseButton';
import { Opt } from 'src/lib/option';

const handleFileSet =
    <T,>(opt: Opt<T>) =>
    (self: Gtk.FileChooserButton): void => {
        const uri = self.get_uri();
        if (!uri) {
            return;
        }

        try {
            const decodedPath = decodeURIComponent(uri.replace('file://', ''));
            opt.set(decodedPath as unknown as T);
        } catch (error) {
            console.error('Failed to decode URI:', error);
        }
    };

export const ImageInputter = <T extends string | number | boolean | object>({
    opt,
}: ImageInputterProps<T>): JSX.Element => {
    return (
        <FileChooserButton
            on_file_set={(self) => {
                return handleFileSet(opt)(self);
            }}
        />
    );
};

interface ImageInputterProps<T> {
    opt: Opt<T>;
}
