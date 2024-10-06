globalThis.isWindowVisible = (windowName: string): boolean => {
    const appWindow = App.getWindow(windowName);

    if (appWindow === undefined) {
        return false;
    }
    return appWindow.visible;
};
