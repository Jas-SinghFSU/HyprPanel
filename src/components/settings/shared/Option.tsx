import { Label } from './Label';
import { Inputter } from './Inputter';
import icons from 'src/lib/icons/icons';
import { RowProps } from 'src/lib/types/options';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';

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
            <box halign={Gtk.Align.START} valign={Gtk.Align.CENTER} hexpand>
                <Label title={props.title} subtitle={props.subtitle} subtitleLink={props.subtitleLink} />
            </box>
            <Inputter
                opt={props.opt}
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
            <button
                className={'reset-options'}
                onClick={(_, event) => {
                    if (isPrimaryClick(event)) {
                        props.opt.reset();
                    }
                }}
                sensitive={bind(props.opt).as((v) => v !== props.opt.initial)}
                valign={Gtk.Align.CENTER}
            >
                <icon icon={icons.ui.refresh} />
            </button>
        </box>
    );
};

interface OptionProps<T> extends RowProps<T> {
    title: string;
    className?: string;
}
