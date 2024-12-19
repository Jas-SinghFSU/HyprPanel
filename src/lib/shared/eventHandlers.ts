import { GtkWidget } from 'src/lib/types/widget.js';
import { Gdk } from 'astal/gtk3';
import { ThrottleFn } from '../types/utils';

/**
 * Connects a primary click handler and returns a disconnect function.
 */
export function onPrimaryClick(widget: GtkWidget, handler: (self: GtkWidget, event: Gdk.Event) => void): () => void {
    const id = widget.connect('button-press-event', (self: GtkWidget, event: Gdk.Event) => {
        const eventButton = event.get_button()[1];
        if (eventButton === Gdk.BUTTON_PRIMARY) {
            handler(self, event);
        }
    });
    return () => widget.disconnect(id);
}

/**
 * Connects a secondary click handler and returns a disconnect function.
 */
export function onSecondaryClick(widget: GtkWidget, handler: (self: GtkWidget, event: Gdk.Event) => void): () => void {
    const id = widget.connect('button-press-event', (self: GtkWidget, event: Gdk.Event) => {
        const eventButton = event.get_button()[1];
        if (eventButton === Gdk.BUTTON_SECONDARY) {
            handler(self, event);
        }
    });
    return () => widget.disconnect(id);
}

/**
 * Connects a middle click handler and returns a disconnect function.
 */
export function onMiddleClick(widget: GtkWidget, handler: (self: GtkWidget, event: Gdk.Event) => void): () => void {
    const id = widget.connect('button-press-event', (self: GtkWidget, event: Gdk.Event) => {
        const eventButton = event.get_button()[1];
        if (eventButton === Gdk.BUTTON_MIDDLE) {
            handler(self, event);
        }
    });
    return () => widget.disconnect(id);
}

/**
 * Connects a scroll handler and returns a disconnect function.
 */
export function onScroll(
    widget: GtkWidget,
    throttledHandler: ThrottleFn,
    scrollUpAction: string,
    scrollDownAction: string,
): () => void {
    const id = widget.connect('scroll-event', (self: GtkWidget, event: Gdk.Event) => {
        const [directionSuccess, direction] = event.get_scroll_direction();
        const [deltasSuccess, , yScroll] = event.get_scroll_deltas();

        if (directionSuccess) {
            handleScrollDirection(direction, scrollUpAction, scrollDownAction, self, event, throttledHandler);
        } else if (deltasSuccess) {
            handleScrollDeltas(yScroll, scrollUpAction, scrollDownAction, self, event, throttledHandler);
        }
    });

    return () => widget.disconnect(id);
}

function handleScrollDirection(
    direction: Gdk.ScrollDirection,
    scrollUpAction: string,
    scrollDownAction: string,
    self: GtkWidget,
    event: Gdk.Event,
    throttledHandler: ThrottleFn,
): void {
    if (direction === Gdk.ScrollDirection.UP) {
        throttledHandler(scrollUpAction, { clicked: self, event });
    } else if (direction === Gdk.ScrollDirection.DOWN) {
        throttledHandler(scrollDownAction, { clicked: self, event });
    }
}

function handleScrollDeltas(
    yScroll: number,
    scrollUpAction: string,
    scrollDownAction: string,
    self: GtkWidget,
    event: Gdk.Event,
    throttledHandler: ThrottleFn,
): void {
    if (yScroll > 0) {
        throttledHandler(scrollDownAction, { clicked: self, event });
    } else if (yScroll < 0) {
        throttledHandler(scrollUpAction, { clicked: self, event });
    }
}
