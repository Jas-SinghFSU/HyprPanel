import { Binding } from 'astal';
import { Astal, Gdk, Gtk } from 'astal/gtk3';
import { Box } from 'astal/gtk3/widget';

export type Exclusivity = 'normal' | 'ignore' | 'exclusive';
export type Anchor = 'left' | 'right' | 'top' | 'down';
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

export type Attribute = unknown;
export type Child = Gtk.Widget;
export type BoxWidget = Gtk.Box;
export type GdkEvent = Gdk.Event;

export type EventHandler<Self> = (self: Self, event: Gdk.Event) => boolean | unknown;
export type EventArgs = {
    clicked: GtkWidget;
    event: Gdk.Event;
};

export interface WidgetProps {
    onPrimaryClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onSecondaryClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onMiddleClick?: (clicked: GtkWidget, event: Gdk.EventButton) => void;
    onScrollUp?: (clicked: GtkWidget, event: Gdk.EventScroll) => void;
    onScrollDown?: (clicked: GtkWidget, event: Gdk.EventScroll) => void;
    setup?: (self: GtkWidget) => void;
}

export interface GtkWidgetExtended extends Gtk.Widget {
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
