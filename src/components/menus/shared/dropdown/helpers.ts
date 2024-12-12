import { calculateMenuPosition } from './locationHandler';
import { App, Gtk } from 'astal/gtk3';
import { DropdownMenuList } from 'src/lib/types/options';

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
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error realizing ${name}: ${error.message}`);
        }
        console.error(`Error realizing ${name}: ${error}`);
    }
};
