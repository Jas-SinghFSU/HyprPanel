import FontButton from 'src/components/shared/FontButton';
import { Opt } from 'src/lib/option';

export const FontInputter = <T extends string | number | boolean | object>({
    opt,
}: FontInputterProps<T>): JSX.Element => {
    return (
        <FontButton
            showSize={false}
            useSize={false}
            setup={(self) => {
                self.font = opt.get() as string;

                self.hook(opt, () => (self.font = opt.value as string));
                self.connect('font-set', ({ font }) => (opt.value = font!.split(' ').slice(0, -1).join(' ') as T));
            }}
        />
    );
};

interface FontInputterProps<T> {
    opt: Opt<T>;
}
