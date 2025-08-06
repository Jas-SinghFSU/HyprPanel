import { bind, Variable } from 'astal';
import icons from 'src/lib/icons/icons';
import { Opt } from 'src/lib/options';

export const FloatInputter = <T extends string | number | boolean | object>({
    opt,
    isUnsaved,
    className,
}: ObjectInputterProps<T>): JSX.Element => {
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
                className={className}
                onChanged={(self) => {
                    const currentText = parseFloat(self.text);
                    const serializedOpt = parseFloat(opt.get().toString());
                    isUnsaved.set(currentText !== serializedOpt);
                }}
                onActivate={(self) => {
                    try {
                        const parsedValue = parseFloat(self.text);
                        opt.set(parsedValue as unknown as T);
                        isUnsaved.set(false);
                    } catch (error) {
                        console.error('Invalid JSON input:', error);
                    }
                }}
                setup={(self) => {
                    self.text = opt.get().toString();
                    isUnsaved.set(self.text !== opt.get().toString());

                    self.hook(opt, () => {
                        self.text = opt.get().toString();
                        isUnsaved.set(self.text !== opt.get().toString());
                    });
                }}
            />
        </box>
    );
};

interface ObjectInputterProps<T> {
    opt: Opt<T>;
    isUnsaved: Variable<boolean>;
    className: string;
}
