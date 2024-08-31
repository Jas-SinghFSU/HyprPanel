import { Binding, Connectable } from "types/service"
import { Variable } from "types/variable"
import { Widget as WidgetType } from "types/widgets/widget"

export type Child = {
    component: Box<Gtk.Widget, unknown>;
    isVisible?: boolean;
    isVis?: Variable<boolean>;
    boxClass: string;
    props: ButtonProps;
};

export type Hook = (self: WidgetType<unknown>) => void;

export type Module = {
    availabilityBind?: Binding,
    icon?: string,
    textIcon?: string,
    label?: string,
    tooltipText?: string,
    boxClass?: string,
    props?: ButtonProps,
    showLabel?: Binding,
    buttonStyle?: string,
    hooks?: Hook[]
}
