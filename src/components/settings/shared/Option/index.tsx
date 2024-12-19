import { RowProps } from 'src/lib/types/options';
import { Variable } from 'astal';
import { PropertyLabel } from './PropertyLabel';
import { ResetButton } from './ResetButton';
import { SettingInput } from './SettingInput';

export const Option = <T extends string | number | boolean | object>({
    className,
    ...props
}: OptionProps<T>): JSX.Element => {
    const isUnsaved = Variable(false);
    return (
        <box
            className={'option-item'}
            hexpand
            onDestroy={() => {
                isUnsaved.drop();
            }}
        >
            <PropertyLabel title={props.title} subtitle={props.subtitle} subtitleLink={props.subtitleLink} />
            <SettingInput isUnsaved={isUnsaved} className={className} {...props} />
            <ResetButton {...props} />
        </box>
    );
};

interface OptionProps<T> extends RowProps<T> {
    title: string;
    className?: string;
}
