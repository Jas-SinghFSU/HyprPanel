import { Label } from './Label';
import { Inputter } from './Inputter';
import icons from 'lib/icons';
import { RowProps } from 'lib/types/options';
import { GBox } from 'lib/types/widget';

export const Option = <T extends string | number | boolean | object>(
    props: RowProps<T>,
    className: string = '',
): GBox => {
    const isUnsaved = Variable(false);

    return Widget.Box({
        class_name: 'option-item',
        hexpand: true,
        children: [
            Widget.Box({
                hpack: 'start',
                vpack: 'center',
                hexpand: true,
                child: Label(props.title, props.subtitle || '', props.subtitleLink),
            }),
            Inputter(props, className, isUnsaved),
            Widget.Button({
                vpack: 'center',
                class_name: 'reset-options',
                child: Widget.Icon(icons.ui.refresh),
                on_clicked: () => props.opt.reset(),
                sensitive: props.opt.bind().as((v) => v !== props.opt.initial),
            }),
        ],
    });
};
