import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import SpinButton from 'src/components/shared/SpinButton';
import icons from 'src/lib/icons/icons';
import { Opt } from 'src/lib/option';
import { useHook } from 'src/lib/shared/hookHandler';

export const NumberInputter = <T extends string | number | boolean | object>({
    opt,
    min,
    max,
    increment = 1,
    isUnsaved,
}: NumberInputterProps<T>): JSX.Element => {
    return (
        <box>
            <box className="unsaved-icon-container" halign={Gtk.Align.START}>
                {bind(isUnsaved).as((unsaved) => {
                    if (unsaved) {
                        return (
                            <icon
                                className="unsaved-icon"
                                icon={icons.ui.warning}
                                tooltipText="Press 'Enter' to apply your changes."
                            />
                        );
                    }
                    return <box />;
                })}
            </box>
            <SpinButton
                setup={(self) => {
                    self.set_range(min, max);
                    self.set_increments(1 * increment, 5 * increment);

                    self.connect('value-changed', () => {
                        opt.set(self.value as T);
                    });

                    useHook(self, opt, () => {
                        self.set_value(opt.get() as number);
                        isUnsaved.set(Number(self.get_text()) !== opt.get());
                    });

                    self.connect('key-release-event', () => {
                        isUnsaved.set(Number(self.get_text()) !== opt.get());
                    });
                }}
            />
        </box>
    );
};

interface NumberInputterProps<T> {
    opt: Opt<T>;
    min: number;
    max: number;
    increment?: number;
    isUnsaved: Variable<boolean>;
}
