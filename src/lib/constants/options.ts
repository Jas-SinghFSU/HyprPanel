import { Gtk } from 'astal/gtk3';

export const StackTransitionMap = {
    none: Gtk.StackTransitionType.NONE,
    crossfade: Gtk.StackTransitionType.CROSSFADE,
    slide_right: Gtk.StackTransitionType.SLIDE_RIGHT,
    slide_left: Gtk.StackTransitionType.SLIDE_LEFT,
    slide_up: Gtk.StackTransitionType.SLIDE_UP,
    slide_down: Gtk.StackTransitionType.SLIDE_DOWN,
};

export const RevealerTransitionMap = {
    none: Gtk.RevealerTransitionType.NONE,
    crossfade: Gtk.RevealerTransitionType.CROSSFADE,
    slide_right: Gtk.RevealerTransitionType.SLIDE_RIGHT,
    slide_left: Gtk.RevealerTransitionType.SLIDE_LEFT,
    slide_up: Gtk.RevealerTransitionType.SLIDE_UP,
    slide_down: Gtk.RevealerTransitionType.SLIDE_DOWN,
};
