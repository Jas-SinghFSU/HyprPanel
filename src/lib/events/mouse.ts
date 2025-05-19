import { Astal, Gdk } from 'astal/gtk3';

/**
 * Checks if an event is a primary click
 * @param event - The click event to check
 * @returns True if the event is a primary click, false otherwise
 */
export const isPrimaryClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_PRIMARY;

/**
 * Checks if an event is a secondary click
 * @param event - The click event to check
 * @returns True if the event is a secondary click, false otherwise
 */
export const isSecondaryClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_SECONDARY;

/**
 * Checks if an event is a middle click
 * @param event - The click event to check
 * @returns True if the event is a middle click, false otherwise
 */
export const isMiddleClick = (event: Astal.ClickEvent): boolean => event.button === Gdk.BUTTON_MIDDLE;

/**
 * Checks if an event is a scroll up
 * @param event - The scroll event to check
 * @returns True if the event is a scroll up, false otherwise
 */
export const isScrollUp = (event: Gdk.Event): boolean => {
    const [directionSuccess, direction] = event.get_scroll_direction();
    const [deltaSuccess, , yScroll] = event.get_scroll_deltas();

    if (directionSuccess && direction === Gdk.ScrollDirection.UP) {
        return true;
    }

    if (deltaSuccess && yScroll < 0) {
        return true;
    }

    return false;
};

/**
 * Checks if an event is a scroll down
 * @param event - The scroll event to check
 * @returns True if the event is a scroll down, false otherwise
 */
export const isScrollDown = (event: Gdk.Event): boolean => {
    const [directionSuccess, direction] = event.get_scroll_direction();
    const [deltaSuccess, , yScroll] = event.get_scroll_deltas();

    if (directionSuccess && direction === Gdk.ScrollDirection.DOWN) {
        return true;
    }

    if (deltaSuccess && yScroll > 0) {
        return true;
    }

    return false;
};
