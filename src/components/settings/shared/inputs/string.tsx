import { bind, Variable } from 'astal';
import icons from 'src/lib/icons/icons';
import { Opt } from 'src/lib/option';

export const StringInputter = <T extends string | number | boolean | object>({
    opt,
    isUnsaved,
}: StringInputterProps<T>): JSX.Element => {
    return (
        <box>
            <box className="unsaved-icon-container">
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
            <entry
                className={bind(isUnsaved).as((unsaved) => (unsaved ? 'unsaved' : ''))}
                onChanged={(self) => {
                    const currentText = self.text;
                    const optValue = opt.get();
                    isUnsaved.set(currentText !== optValue);
                }}
                onActivate={(self) => {
                    opt.set(self.text as T);
                }}
                setup={(self) => {
                    self.text = opt.get() as string;
                    isUnsaved.set(self.text !== opt.get());

                    self.hook(opt, () => {
                        isUnsaved.set(self.text !== opt.get());
                        self.text = opt.get() as string;
                    });
                }}
            />
        </box>
    );
};
interface StringInputterProps<T> {
    opt: Opt<T>;
    isUnsaved: Variable<boolean>;
}
