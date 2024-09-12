import { Opt } from 'lib/option';
import { Attribute, BoxWidget } from 'lib/types/widget';
import { Variable } from 'types/variable';

import { dependencies as checkDependencies } from 'lib/utils';

export const booleanInputter = <T>(
    self: BoxWidget,
    opt: Opt<T>,
    disabledBinding: Variable<boolean> | undefined,
    dependencies: string[] | undefined,
): Attribute => {
    return (self.child = Widget.Switch({
        sensitive: disabledBinding !== undefined ? disabledBinding.bind('value').as((disabled) => !disabled) : true,
    })
        .on('notify::active', (self) => {
            if (disabledBinding !== undefined && disabledBinding.value) {
                return;
            }
            if (self.active && dependencies !== undefined && !dependencies.every((d) => checkDependencies(d))) {
                self.active = false;
                return;
            }
            opt.value = self.active as T;
        })
        .hook(opt, (self) => {
            self.active = opt.value as boolean;
        }));
};
