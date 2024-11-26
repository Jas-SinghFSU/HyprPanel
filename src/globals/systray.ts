import AstalTray from 'gi://AstalTray';
const systemtray = AstalTray.get_default();

globalThis.getSystrayItems = (): string => {
    return systemtray.items.map((systrayItem) => systrayItem.id).join('\n');
};

export { getSystrayItems };
