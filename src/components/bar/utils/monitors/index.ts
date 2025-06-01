import { Gdk } from 'astal/gtk3';
import { BarLayout, BarLayouts } from 'src/lib/options/types';
import { GdkMonitorService } from 'src/services/display/monitor';
import { MonitorMapping } from './types';
import { JSXElement } from 'src/core/types';

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
 * Creates widgets for all available monitors with proper GDK to Hyprland monitor mapping.
 *
 * @param widget - Function that creates a widget for a given monitor index
 * @returns Array of created widgets for all available monitors
 */
export async function forMonitors(
    widget: (monitor: number, hyprlandMonitor?: number) => Promise<JSXElement>,
): Promise<JSXElement[]> {
    const monitorCount = Gdk.Display.get_default()?.get_n_monitors() ?? 1;
    const gdkMonitorService = GdkMonitorService.getInstance();
    const monitorMappings: MonitorMapping[] = [];

    for (let gdkMonitorIndex = 0; gdkMonitorIndex < monitorCount; gdkMonitorIndex++) {
        const hyprlandId = gdkMonitorService.mapGdkToHyprland(gdkMonitorIndex);
        monitorMappings.push({
            gdkIndex: gdkMonitorIndex,
            hyprlandId,
        });
    }

    return Promise.all(monitorMappings.map(({ gdkIndex, hyprlandId }) => widget(gdkIndex, hyprlandId)));
}
