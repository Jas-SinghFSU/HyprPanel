import { RowProps } from 'src/lib/types/options';
import { NumberInputter } from './inputs/number';
import { ObjectInputter } from './inputs/object';
import { StringInputter } from './inputs/string';
import { BooleanInputter } from './inputs/boolean';
import { ImageInputter } from './inputs/image';
import { ImportInputter } from './inputs/import';
import { WallpaperInputter } from './inputs/wallpaper';
import { ColorInputter } from './inputs/color';
import { EnumInputter } from './inputs/enum';
import { FontInputter } from './inputs/font';
import { Variable } from 'astal';
import { Gtk } from 'astal/gtk3';

const InputField = <T extends string | number | boolean | object>({
    opt,
    fontStyle,
    fontLabel,
    type = typeof opt.get() as RowProps<T>['type'],
    enums = [],
    disabledBinding,
    dependencies,
    exportData,
    min = 0,
    max = 1000000,
    increment = 1,
    className = '',
    isUnsaved,
}: InputFieldProps<T>): JSX.Element => {
    switch (type) {
        case 'number':
            return <NumberInputter opt={opt} min={min} max={max} increment={increment} isUnsaved={isUnsaved} />;
        case 'float':
        case 'object':
            return <ObjectInputter opt={opt} isUnsaved={isUnsaved} className={className} />;
        case 'string':
            return <StringInputter opt={opt} isUnsaved={isUnsaved} />;
        case 'enum':
            return <EnumInputter opt={opt} values={enums} />;
        case 'boolean':
            return <BooleanInputter opt={opt} disabledBinding={disabledBinding} dependencies={dependencies} />;
        case 'img':
            return <ImageInputter opt={opt} />;
        case 'config_import':
            return <ImportInputter exportData={exportData} />;
        case 'wallpaper':
            return <WallpaperInputter opt={opt} />;
        case 'font':
            return <FontInputter fontFamily={opt} fontLabel={fontLabel} fontStyle={fontStyle} />;
        case 'color':
            return <ColorInputter opt={opt} />;

        default:
            return <label label={`No setter with type ${type}`} />;
    }
};

export const Inputter = <T extends string | number | boolean | object>({
    opt,
    fontStyle,
    fontLabel,
    type = typeof opt.get() as RowProps<T>['type'],
    enums,
    disabledBinding,
    dependencies,
    exportData,
    min,
    max,
    increment,
    className,
    isUnsaved,
}: InputterProps<T>): JSX.Element => {
    return (
        <box className={/export|import/.test(type || '') ? '' : 'inputter-container'} valign={Gtk.Align.CENTER}>
            <InputField
                type={type}
                opt={opt}
                fontStyle={fontStyle}
                fontLabel={fontLabel}
                enums={enums}
                disabledBinding={disabledBinding}
                dependencies={dependencies}
                exportData={exportData}
                min={min}
                max={max}
                increment={increment}
                className={className}
                isUnsaved={isUnsaved}
            />
        </box>
    );
};

interface InputterProps<T> extends RowProps<T> {
    className?: string;
    isUnsaved: Variable<boolean>;
}

interface InputFieldProps<T> extends RowProps<T> {
    className?: string;
    isUnsaved: Variable<boolean>;
}
