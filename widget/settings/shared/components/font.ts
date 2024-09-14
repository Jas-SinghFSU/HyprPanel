import { Opt } from 'lib/option';
import { Attribute, BoxWidget, Child } from 'lib/types/widget';
import FontButton from 'types/widgets/fontbutton';

export const fontInputter = <T>(self: BoxWidget, opt: Opt<T>): FontButton<Child, Attribute> => {
    return (self.child = Widget.FontButton({
        show_size: false,
        use_size: false,
        setup: (self) =>
            self
                .hook(opt, () => (self.font = opt.value as string))
                .on('font-set', ({ font }) => (opt.value = font!.split(' ').slice(0, -1).join(' ') as T)),
    }));
};
