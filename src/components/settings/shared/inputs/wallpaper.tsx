import FileChooserButton from 'src/components/shared/FileChooseButton';
import { Opt } from 'src/lib/option';
import Wallpaper from 'src/services/Wallpaper';

export const WallpaperInputter = <T extends string | number | boolean | object>({
    opt,
}: WallpaperInputterProps<T>): JSX.Element => {
    if (typeof opt.get() === 'string') {
        return (
            <FileChooserButton
                onFileSet={(self) => {
                    const newValue: string = self.get_uri()!.replace('file://', '');
                    opt.set(newValue as T);
                    if (options.wallpaper.enable.get()) {
                        Wallpaper.setWallpaper(newValue);
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
