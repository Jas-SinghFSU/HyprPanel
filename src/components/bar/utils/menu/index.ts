import { App, Gdk } from 'astal/gtk3';
import { calculateMenuPosition } from 'src/components/menus/shared/dropdown/helpers/locationHandler';
import { GtkWidget } from '../../types';

/**
 * Opens a dropdown menu centered relative to the clicked button
 *
 * This function handles the positioning logic to ensure menus appear centered
 * relative to the button that was clicked, regardless of where on the button
 * the click occurred. It calculates the offset needed to center the menu
 * based on the click position within the button's bounds.
 *
 * @param clicked - The widget that was clicked to trigger the menu
 * @param event - The click event containing position information
 * @param window - The name of the menu window to open
 */
export const openDropdownMenu = async (
    clicked: GtkWidget,
    event: Gdk.Event,
    window: string,
): Promise<void> => {
    try {
        const middleOfButton = Math.floor(clicked.get_allocated_width() / 2);
        const xAxisOfButtonClick = clicked.get_pointer()[0];
        const middleOffset = middleOfButton - xAxisOfButtonClick;

        const clickPos = event.get_root_coords();
        const adjustedXCoord = clickPos[1] + middleOffset;
        const coords = [adjustedXCoord, clickPos[2]];

        await calculateMenuPosition(coords, window);

        closeAllMenus();
        App.toggle_window(window);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error calculating menu position: ${error.stack}`);
        } else {
            console.error(`Unknown error occurred: ${error}`);
        }
    }
};

/**
 * Closes all currently open menu windows
 *
 * This function finds all windows whose names contain "menu" and
 * hides them. It's used to ensure only one menu is open at a time
 * when opening a new dropdown menu.
 */
function closeAllMenus(): void {
    const menuWindows = App.get_windows()
        .filter((w) => {
            if (w.name) {
                return /.*menu/.test(w.name);
            }

            return false;
        })
        .map((window) => window.name);

    menuWindows.forEach((window) => {
        if (window) {
            App.get_window(window)?.set_visible(false);
        }
    });
}
