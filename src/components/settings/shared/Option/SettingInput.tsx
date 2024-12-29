import { Variable } from 'astal';
import { RowProps } from 'src/lib/types/options';
import { Inputter } from '../Inputter';

export const SettingInput = <T extends string | number | boolean | object>({
    className,
    isUnsaved,
    ...props
}: SettingInputProps<T>): JSX.Element => {
    return (
        <Inputter
            opt={props.opt}
            fontStyle={props.fontStyle}
            fontLabel={props.fontLabel}
            type={props.type}
            enums={props.enums}
            disabledBinding={props.disabledBinding}
            dependencies={props.dependencies}
            exportData={props.exportData}
            min={props.min}
            max={props.max}
            increment={props.increment}
            className={className}
            isUnsaved={isUnsaved}
        />
    );
};

interface SettingInputProps<T> extends RowProps<T> {
    className?: string;
    isUnsaved: Variable<boolean>;
}
