import { Gdk } from 'astal/gtk3';
import ColorButton from 'src/components/shared/ColorButton';
import { Opt } from 'src/lib/option';
import { useHook } from 'src/lib/shared/hookHandler';

export const ColorInputter = <T extends string | number | boolean | object>({
    opt,
}: ColorInputterProps<T>): JSX.Element => {
    return (
        <ColorButton
            setup={(self) => {
                useHook(self, opt, () => {
                    const rgba = new Gdk.RGBA();
                    rgba.parse(opt.get() as string);
                    self.rgba = rgba;
                });

                self.connect('color-set', ({ rgba: { red, green, blue } }) => {
                    const hex = (n: number): string => {
                        const c = Math.floor(255 * n).toString(16);
                        return c.length === 1 ? `0${c}` : c;
                    };

                    opt.set(`#${hex(red)}${hex(green)}${hex(blue)}` as T);
                });
            }}
        />
    );
};

interface ColorInputterProps<T> {
    opt: Opt<T>;
}
