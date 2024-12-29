import FontButton from 'src/components/shared/FontButton';
import { Opt } from 'src/lib/option';
import { styleToString } from './utils';

export const FontInputter = <T extends string | number | boolean | object>({
    fontFamily,
    fontStyle,
    fontLabel,
}: FontInputterProps<T>): JSX.Element => (
    <FontButton
        showSize={false}
        useSize={false}
        setup={(self) => {
            self.font = fontLabel?.get() ?? (fontFamily.get() as string);

            if (fontLabel) {
                self.hook(fontLabel, () => {
                    self.font = fontLabel.get() as string;
                });
            } else {
                self.hook(fontFamily, () => {
                    self.font = fontFamily.get() as string;
                });
            }

            self.connect('font-set', ({ fontDesc, font }) => {
                const selectedFontFamily = fontDesc.get_family();
                const selectedFontStyle = styleToString(fontDesc.get_style());

                fontFamily.set(selectedFontFamily as T);

                fontStyle?.set(selectedFontStyle);
                fontLabel?.set(font.split(' ').slice(0, -1).join(' '));
            });
        }}
    />
);

interface FontInputterProps<T> {
    fontFamily: Opt<T>;
    fontStyle?: Opt<string>;
    fontLabel?: Opt<string>;
}
