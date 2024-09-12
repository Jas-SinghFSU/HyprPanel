import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';
import Wallpaper from 'services/Wallpaper';

export const wallpaperInputter = (self: BoxWidget, opt: Opt<string>): Attribute | void => {
    return (self.child = Widget.FileChooserButton({
        on_file_set: ({ uri }) => {
            const newValue = uri!.replace('file://', '');
            opt.value = newValue;
            if (options.wallpaper.enable.value) {
                Wallpaper.set(newValue);
            }
        },
    }));
};
