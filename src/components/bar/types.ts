import { Astal, Gdk, Gtk, Widget } from 'astal/gtk3';
import { Binding } from 'astal';
import { Connectable } from 'astal/binding';
import { Label } from 'astal/gtk3/widget';

export type BarBoxChild = {
    component: JSX.Element;
    isVisible?: boolean;
    isVis?: Binding<boolean>;
    isBox?: boolean;
    boxClass: string;
    tooltip_text?: string | Binding<string>;
} & ({ isBox: true; props: Widget.EventBoxProps } | { isBox?: false; props: Widget.ButtonProps });

type BoxHook = (self: Gtk.Box) => void;
type LabelHook = (self: Label) => void;

export type BarModuleProps = {
    icon?: string | Binding<string>;
    textIcon?: string | Binding<string>;
    useTextIcon?: Binding<boolean>;
    label?: string | Binding<string>;
    truncationSize?: Binding<number>;
    labelHook?: LabelHook;
    boundLabel?: string;
    tooltipText?: string | Binding<string>;
    boxClass: string;
    isVis?: Binding<boolean>;
    props?: Widget.ButtonProps;
    showLabel?: boolean;
    showLabelBinding?: Binding<boolean>;
    showIconBinding?: Binding<boolean>;
    hook?: BoxHook;
    connection?: Binding<Connectable>;
};

interface WidgetProps {
    onPrimaryClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onSecondaryClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onMiddleClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onScrollUp?: (clicked: GtkWidget, event: Gdk.EventScroll) => void;
    onScrollDown?: (clicked: GtkWidget, event: Gdk.EventScroll) => void;
    setup?: (self: GtkWidget) => void;
}

interface GtkWidgetExtended extends Gtk.Widget {
    props?: WidgetProps;
    component?: JSX.Element;
    primaryClick?: (clicked: GtkWidget, event: Astal.ClickEvent) => void;
    isVisible?: boolean;
    boxClass?: string;
    isVis?: {
        bind: (key: string) => Binding<boolean>;
    };
}

export type GtkWidget = GtkWidgetExtended;
