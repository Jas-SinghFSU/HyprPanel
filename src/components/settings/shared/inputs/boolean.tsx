import { bind, Variable } from 'astal';
import { Opt } from 'src/lib/option';

import { dependencies as checkDependencies } from 'src/lib/utils';

export const BooleanInputter = <T extends string | number | boolean | object>({
    opt,
    disabledBinding,
    dependencies,
}: BooleanInputterProps<T>): JSX.Element => (
    <switch
        sensitive={disabledBinding !== undefined ? bind(disabledBinding).as((disabled) => !disabled) : true}
        setup={(self) => {
            self.connect('notify::active', () => {
                if (disabledBinding !== undefined && disabledBinding.get()) {
                    return;
                }

                if (self.active && dependencies !== undefined && !dependencies.every((dep) => checkDependencies(dep))) {
                    self.active = false;
                    return;
                }

                opt.set(self.active as T);
            });

            self.hook(opt, () => {
                self.active = opt.get() as boolean;
            });
        }}
    />
);

interface BooleanInputterProps<T> {
    opt: Opt<T>;
    isUnsaved?: Variable<boolean>;
    disabledBinding?: Variable<boolean>;
    dependencies?: string[];
}
