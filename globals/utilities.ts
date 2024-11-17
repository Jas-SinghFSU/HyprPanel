import options from 'options';

globalThis.isWindowVisible = (windowName: string): boolean => {
    const appWindow = App.getWindow(windowName);

    if (appWindow === undefined) {
        return false;
    }
    return appWindow.visible;
};

globalThis.setLayout = (layout: string): string => {
    console.log(layout);

    try {
        const layoutJson = JSON.parse(layout);
        const { layouts } = options.bar;

        layouts.value = layoutJson;
        return 'Successfully updated layout.';
    } catch (error) {
        return `Failed to set layout: ${error}`;
    }
};
