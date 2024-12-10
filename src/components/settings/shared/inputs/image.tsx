import FileChooserButton from 'src/components/shared/FileChooseButton';
import { Opt } from 'src/lib/option';

const handleFileSet =
    <T,>(opt: Opt<T>) =>
    ({ uri }: { uri: string | null }): void => {
        if (!uri) {
            console.warn('No URI selected');
            return;
        }

        try {
            const decodedPath = decodeURIComponent(uri.replace('file://', ''));
            opt.value = decodedPath as unknown as T;
        } catch (error) {
            console.error('Failed to decode URI:', error);
        }
    };

export const ImageInputter = <T extends string | number | boolean | object>({
    opt,
}: ImageInputterProps<T>): JSX.Element => {
    return <FileChooserButton on_file_set={() => handleFileSet(opt)} />;
};

interface ImageInputterProps<T> {
    opt: Opt<T>;
}
