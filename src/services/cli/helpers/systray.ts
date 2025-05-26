import AstalTray from 'gi://AstalTray';
import { errorHandler } from 'src/core/errors/handler';
const systemtray = AstalTray.get_default();

/**
 * Retrieves all system tray items and returns their IDs
 *
 * @returns A newline-separated string of system tray item IDs
 */
export function getSystrayItems(): string {
    try {
        const items = systemtray
            .get_items()
            .map((systrayItem) => systrayItem.id)
            .join('\n');

        return items;
    } catch (error) {
        errorHandler(error);
    }
}
