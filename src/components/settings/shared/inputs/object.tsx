import { bind, Variable } from 'astal';
import icons from 'src/lib/icons/icons';
import { Opt } from 'src/lib/option';

export const ObjectInputter = <T extends string | number | boolean | object>({
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
                    const currentText = self.text;
                    const serializedOpt = JSON.stringify(opt.get());
                    isUnsaved.set(currentText !== serializedOpt);
                }}
                onActivate={(self) => {
                    try {
                        const parsedValue = JSON.parse(self.text || '{}');
                        opt.set(parsedValue);
                        isUnsaved.set(false);
                    } catch (error) {
                        console.error('Invalid JSON input:', error);
                    }
                }}
                setup={(self) => {
                    self.text = JSON.stringify(opt.get());
                    isUnsaved.set(self.text !== JSON.stringify(opt.get()));

                    self.hook(opt, () => {
                        self.text = JSON.stringify(opt.get());
                        isUnsaved.set(self.text !== JSON.stringify(opt.get()));
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
