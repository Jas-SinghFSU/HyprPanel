import { closeAllMenus } from 'src/components/bar/utils/menu';
import { calculateMenuPosition } from './locationHandler';
import { App, Gtk } from 'astal/gtk3';

export const handleRealization = async (name: string): Promise<void> => {
    const appWindow = App.get_window(name);

    const coords = [10000, 10000];

    if (appWindow) {
        await calculateMenuPosition(coords, name);
    }

    closeAllMenus();

    appWindow?.set_visible(true);

    while (Gtk.events_pending()) {
        Gtk.main_iteration();
    }

    appWindow?.set_visible(false);
};
