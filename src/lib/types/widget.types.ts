import { Binding } from 'astal';
import { Astal, Gdk, Gtk } from 'astal/gtk3';

export type Transition = 'none' | 'crossfade' | 'slide_right' | 'slide_left' | 'slide_up' | 'slide_down';

export type Layouts =
    | 'center'
    | 'top'
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type BoxWidget = Gtk.Box;

export type EventArgs = {
    clicked: GtkWidget;
    event: Gdk.Event;
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
