import AstalTray from 'gi://AstalTray';
import { errorHandler } from 'src/core/errors/handler';
const systemtray = AstalTray.get_default();

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
