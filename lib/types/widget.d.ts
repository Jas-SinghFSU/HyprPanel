import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';
import Box from 'types/widgets/box';

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
export type GtkWidget = Gtk.Widget;
export type BoxWidget = Box<GtkWidget, Child>;

export type GButton = Gtk.Button;
export type GBox = Gtk.Box;
export type GLabel = Gtk.Label;
export type GCenterBox = Gtk.Box;

export type EventHandler<Self> = (self: Self, event: Gdk.Event) => boolean | unknown;
export type EventArgs = { clicked: Button<Child, Attribute>; event: Gdk.Event };
