import { Opt } from 'src/lib/option';
import { Attribute, BoxWidget } from 'src/lib/types/widget';
import Wallpaper from 'src/services/Wallpaper';

export const wallpaperInputter = <T extends string | number | boolean | object>(
    self: BoxWidget,
    opt: Opt<T>,
): Attribute | void => {
    if (typeof opt.value === 'string') {
        return (self.child = Widget.FileChooserButton({
            on_file_set: ({ uri }) => {
                const newValue: string = uri!.replace('file://', '');
                opt.value = newValue as T;
                if (options.wallpaper.enable.value) {
                    Wallpaper.set(newValue);
                }
            },
        }));
    }
};
