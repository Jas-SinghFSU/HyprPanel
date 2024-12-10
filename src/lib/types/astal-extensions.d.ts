import { Gdk } from 'astal/gtk3';

declare module 'astal/gtk3' {
    interface EventButton extends Gdk.Event {
        get_root_coords(): [number, number];
    }

    interface EventScroll extends Gdk.Event {
        direction: Gdk.ScrollDirection;
    }
}
