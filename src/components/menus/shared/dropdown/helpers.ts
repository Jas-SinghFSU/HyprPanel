import { closeAllMenus } from 'src/components/bar/utils/menu';
import { calculateMenuPosition } from './locationHandler';
import { App, Gtk } from 'astal/gtk3';

export const handleRealization = async (name: string): Promise<void> => {
    const appWindow = App.get_window(name);

    if (!appWindow) {
        return;
    }

    const coords = [100000, 100000];

    await calculateMenuPosition(coords, name);

    closeAllMenus();

    appWindow?.set_visible(true);

    while (Gtk.events_pending()) {
        Gtk.main_iteration();
    }

    appWindow?.set_visible(false);
};
