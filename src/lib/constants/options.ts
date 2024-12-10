import { Gtk } from 'astal/gtk3';

export const StackTransitionMap = {
    none: Gtk.StackTransitionType.NONE,
    crossfade: Gtk.StackTransitionType.CROSSFADE,
    slide_right: Gtk.StackTransitionType.SLIDE_RIGHT,
    slide_left: Gtk.StackTransitionType.SLIDE_LEFT,
    slide_up: Gtk.StackTransitionType.SLIDE_UP,
    slide_down: Gtk.StackTransitionType.SLIDE_DOWN,
};
