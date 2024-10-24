import Gdk from 'gi://Gdk?version=3.0';
import { Attribute, Child } from 'lib/types/widget';
import { calculateMenuPosition } from 'modules/menus/shared/dropdown/locationHandler/index';
import Button from 'types/widgets/button';

export const closeAllMenus = (): void => {
    const menuWindows = App.windows
        .filter((w) => {
            if (w.name) {
                return /.*menu/.test(w.name);
            }

            return false;
        })
        .map((w) => w.name);

    menuWindows.forEach((w) => {
        if (w) {
            App.closeWindow(w);
        }
    });
};

export const openMenu = async (clicked: Button<Child, Attribute>, event: Gdk.Event, window: string): Promise<void> => {
    /*
     * NOTE: We have to make some adjustments so the menu pops up relatively
     * to the center of the button clicked. We don't want the menu to spawn
     * offcenter depending on which edge of the button you click on.
     * -------------
     * To fix this, we take the x coordinate of the click within the button's bounds.
     * If you click the left edge of a 100 width button, then the x axis will be 0
     * and if you click the right edge then the x axis will be 100.
     * -------------
     * Then we divide the width of the button by 2 to get the center of the button and then get
     * the offset by subtracting the clicked x coordinate. Then we can apply that offset
     * to the x coordinate of the click relative to the screen to get the center of the
     * icon click.
     */

    const middleOfButton = Math.floor(clicked.get_allocated_width() / 2);
    const xAxisOfButtonClick = clicked.get_pointer()[0];
    const middleOffset = middleOfButton - xAxisOfButtonClick;

    const clickPos = event.get_root_coords();
    const adjustedXCoord = clickPos[1] + middleOffset;
    const coords = [adjustedXCoord, clickPos[2]];

    try {
        await calculateMenuPosition(coords, window);
    } catch (error) {
        console.error(`Error calculating menu position: ${error}`);
    }

    closeAllMenus();
    App.toggleWindow(window);
};
