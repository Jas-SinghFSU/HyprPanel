import Gdk from 'gi://Gdk';
import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';

export const colorInputter = <T>(self: BoxWidget, opt: Opt<T>): Attribute => {
    return (self.child = Widget.ColorButton()
        .hook(opt, (self) => {
            const rgba = new Gdk.RGBA();
            rgba.parse(opt.value as string);
            self.rgba = rgba;
        })
        .on('color-set', ({ rgba: { red, green, blue } }) => {
            const hex = (n: number): string => {
                const c = Math.floor(255 * n).toString(16);
                return c.length === 1 ? `0${c}` : c;
            };
            opt.value = `#${hex(red)}${hex(green)}${hex(blue)}` as T;
        }));
};
