import { calculateMenuPosition } from './locationHandler';
import { App, Gtk } from 'astal/gtk3';
import { DropdownMenuList } from 'src/lib/types/options';

/**
 * Handles the realization of a dropdown menu.
 *
 * This function attempts to realize a dropdown menu by calculating its position and setting its visibility.
 * It also processes any pending GTK events to ensure the menu is properly displayed and then hides it.
 * If an error occurs during the realization process, it logs the error message.
 *
 * The primary purpose of this function is to render the menus at least once to generate and calculate their
 * gemoetry. That way when they're opened later, they'll be displayed at the correct position.
 *
 * The menus are originally realized off-screen to prevent flickering when they're opened.
 *
 * @param name The name of the dropdown menu to realize.
 */
export const handleRealization = async (name: DropdownMenuList): Promise<void> => {
    try {
        const appWindow = App.get_window(name);

        if (!appWindow) {
            return;
        }

        const coords = [100000, 100000];

        await calculateMenuPosition(coords, name);

        appWindow?.set_visible(true);

        while (Gtk.events_pending()) {
            Gtk.main_iteration();
        }

        appWindow?.set_visible(false);

        await calculateMenuPosition([0, 0], name);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error realizing ${name}: ${error.message}`);
        }
        console.error(`Error realizing ${name}: ${error}`);
    }
};
