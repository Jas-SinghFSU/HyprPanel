import { App } from 'astal/gtk3';
import options from '../options';
import { Variable } from 'astal';
import { BarLayouts } from 'src/lib/options/options.types';

export function isWindowVisible(windowName: string): boolean {
    const appWindow = App.get_window(windowName);

    if (appWindow === undefined || appWindow === null) {
        throw new Error(`Window with name "${windowName}" not found.`);
    }

    return appWindow.visible;
}

export function setLayout(layout: BarLayouts): string {
    try {
        const { layouts } = options.bar;

        layouts.set(layout);
        return 'Successfully updated layout.';
    } catch (error) {
        return `Failed to set layout: ${error}`;
    }
}

export const idleInhibit = Variable(false);
