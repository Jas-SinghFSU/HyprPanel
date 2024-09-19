import icons from 'lib/icons';
import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';
import { Variable } from 'types/variable';

export const objectInputter = <T>(
    self: BoxWidget,
    opt: Opt<T>,
    isUnsaved: Variable<boolean>,
    className: string,
): Attribute => {
    return (self.children = [
        Widget.Box({
            class_name: 'unsaved-icon-container',
            child: isUnsaved.bind('value').as((unsvd) => {
                if (unsvd) {
                    return Widget.Icon({
                        class_name: 'unsaved-icon',
                        icon: icons.ui.warning,
                        tooltipText: "Press 'Enter' to apply your changes.",
                    });
                }
                return Widget.Box();
            }),
        }),
        Widget.Entry({
            class_name: className,
            on_change: (self) => (isUnsaved.value = self.text !== JSON.stringify(opt.value)),
            on_accept: (self) => (opt.value = JSON.parse(self.text || '')),
            setup: (self) =>
                self.hook(opt, () => {
                    self.text = JSON.stringify(opt.value);
                    isUnsaved.value = self.text !== JSON.stringify(opt.value);
                }),
        }),
    ]);
};
