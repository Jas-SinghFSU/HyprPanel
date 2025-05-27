import { App } from 'astal/gtk3';
import { Variable } from 'astal';

export function isWindowVisible(windowName: string): boolean {
    const appWindow = App.get_window(windowName);

    if (appWindow === undefined || appWindow === null) {
        throw new Error(`Window with name "${windowName}" not found.`);
    }

    return appWindow.visible;
}

export const idleInhibit = Variable(false);
