const systemtray = await Service.import('systemtray');

globalThis.getSystrayItems = (): string => {
    return systemtray.items.map((systrayItem) => systrayItem.id).join('\n');
};

export { getSystrayItems };
