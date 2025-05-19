import { Gdk } from 'astal/gtk3';
import { range } from 'src/lib/array/helpers';
import { BarLayout, BarLayouts } from 'src/lib/options/options.types';

/**
 * Returns the bar layout configuration for a specific monitor
 *
 * @param monitor - Monitor ID number
 * @param layouts - Object containing layout configurations for different monitors
 * @returns BarLayout configuration for the specified monitor, falling back to default if not found
 */
export const getLayoutForMonitor = (monitor: number, layouts: BarLayouts): BarLayout => {
    const matchingKey = Object.keys(layouts).find((key) => key === monitor.toString());
    const wildcard = Object.keys(layouts).find((key) => key === '*');

    if (matchingKey !== undefined) {
        return layouts[matchingKey];
    }

    if (wildcard) {
        return layouts[wildcard];
    }

    return {
        left: ['dashboard', 'workspaces', 'windowtitle'],
        middle: ['media'],
        right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
    };
};

/**
 * Checks if a bar layout configuration is empty
 *
 * @param layout - Bar layout configuration to check
 * @returns boolean indicating if all sections of the layout are empty
 */
export const isLayoutEmpty = (layout: BarLayout): boolean => {
    const isLeftSectionEmpty = !Array.isArray(layout.left) || layout.left.length === 0;
    const isRightSectionEmpty = !Array.isArray(layout.right) || layout.right.length === 0;
    const isMiddleSectionEmpty = !Array.isArray(layout.middle) || layout.middle.length === 0;

    return isLeftSectionEmpty && isRightSectionEmpty && isMiddleSectionEmpty;
};

/**
 * Generates an array of JSX elements for each monitor.
 *
 * This function creates an array of JSX elements by calling the provided widget function for each monitor.
 * It uses the number of monitors available in the default Gdk display.
 *
 * @param widget A function that takes a monitor index and returns a JSX element.
 *
 * @returns An array of JSX elements, one for each monitor.
 */
export async function forMonitors(widget: (monitor: number) => Promise<JSX.Element>): Promise<JSX.Element[]> {
    const n = Gdk.Display.get_default()?.get_n_monitors() ?? 1;

    return Promise.all(range(n, 0).map(widget));
}
