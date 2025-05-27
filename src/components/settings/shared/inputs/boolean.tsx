import { Binding } from 'astal';
import { bind, Variable } from 'astal';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import { Opt } from 'src/lib/options';

export const BooleanInputter = <T extends string | number | boolean | object>({
    opt,
    disabledBinding,
    dependencies,
}: BooleanInputterProps<T>): JSX.Element => (
    <switch
        sensitive={disabledBinding !== undefined ? bind(disabledBinding).as((disabled) => !disabled) : true}
        active={bind(opt) as Binding<boolean>}
        setup={(self) => {
            self.connect('notify::active', () => {
                if (disabledBinding !== undefined && disabledBinding.get()) {
                    return;
                }

                if (
                    self.active &&
                    dependencies !== undefined &&
                    !dependencies.every((dep) => SystemUtilities.checkDependencies(dep))
                ) {
                    self.active = false;
                    return;
                }

                opt.set(self.active as T);
            });
        }}
    />
);

interface BooleanInputterProps<T> {
    opt: Opt<T>;
    disabledBinding?: Variable<boolean>;
    dependencies?: string[];
}
