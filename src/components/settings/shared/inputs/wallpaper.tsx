import FileChooserButton from 'src/components/shared/FileChooserButton';
import { Opt } from 'src/lib/option';
import Wallpaper from 'src/services/Wallpaper';
import options from 'src/options';

export const WallpaperInputter = <T extends string | number | boolean | object>({
    opt,
}: WallpaperInputterProps<T>): JSX.Element => {
    if (typeof opt.get() === 'string') {
        return (
            <FileChooserButton
                onFileSet={(self) => {
                    const fileUri = self.get_uri();

                    if (fileUri === null) {
                        console.warn('Failed to set wallpaper: File URI is null.');
                        return;
                    }

                    const filePath: string = decodeURIComponent(fileUri.replace('file://', ''));

                    opt.set(filePath as T);

                    if (options.wallpaper.enable.get()) {
                        Wallpaper.setWallpaper(filePath);
                    }
                }}
            />
        );
    }

    return <box />;
};

interface WallpaperInputterProps<T> {
    opt: Opt<T>;
}
