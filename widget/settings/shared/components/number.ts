import icons from 'lib/icons';
import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';
import { Variable } from 'types/variable';

export const numberInputter = <T>(
    self: BoxWidget,
    opt: Opt<T>,
    min: number,
    max: number,
    increment = 1,
    isUnsaved: Variable<boolean>,
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
        Widget.SpinButton({
            setup(self) {
                self.set_range(min, max);
                self.set_increments(1 * increment, 5 * increment);
                self.on('value-changed', () => {
                    opt.value = self.value as T;
                });
                self.hook(opt, () => {
                    self.value = opt.value as number;
                    isUnsaved.value = Number(self.text) !== (opt.value as number);
                });
                self.connect('key-release-event', () => {
                    isUnsaved.value = Number(self.text) !== (opt.value as number);
                });
            },
        }),
    ]);
};
