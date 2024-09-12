import icons from 'lib/icons';
import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';
import { Variable } from 'types/variable';

export const stringInputter = <T>(self: BoxWidget, opt: Opt<T>, isUnsaved: Variable<boolean>): Attribute => {
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
            class_name: isUnsaved.bind('value').as((unsaved) => (unsaved ? 'unsaved' : '')),
            on_change: (self) => (isUnsaved.value = self.text !== opt.value),
            on_accept: (self) => {
                opt.value = self.text as T;
            },
            setup: (self) =>
                self.hook(opt, () => {
                    isUnsaved.value = self.text !== opt.value;
                    self.text = opt.value as string;
                }),
        }),
    ]);
};
