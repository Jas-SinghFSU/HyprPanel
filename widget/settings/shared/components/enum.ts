import { Opt } from 'lib/option';
import { BoxWidget } from 'lib/types/widget';
import icons from 'lib/icons';
import { Box } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';

export const enumInputter = <T extends string | number | boolean | object>(
    self: BoxWidget,
    opt: Opt<T>,
    values: T[],
): Box => {
    const lbl = Widget.Label({ label: opt.bind().as((v) => `${v}`) });
    const step = (dir: 1 | -1): void => {
        const i = values.findIndex((i) => i === lbl.label);
        opt.setValue(
            dir > 0
                ? i + dir > values.length - 1
                    ? values[0]
                    : values[i + dir]
                : i + dir < 0
                  ? values[values.length - 1]
                  : values[i + dir],
        );
    };
    const next = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.right),
        on_clicked: () => step(+1),
    });
    const prev = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.left),
        on_clicked: () => step(-1),
    });
    return (self.child = Widget.Box({
        class_name: 'enum-setter',
        children: [lbl, prev, next],
    }));
};
