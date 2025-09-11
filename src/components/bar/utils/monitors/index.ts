import { Gdk } from 'astal/gtk3';
import { BarLayout, BarLayouts } from 'src/lib/options/types';
import { GdkMonitorService } from 'src/services/display/monitor';
import { MonitorMapping } from './types';
import { JSXElement } from 'src/core/types';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const emptyBar = {
    left: [],
    middle: [],
    right: [],
};

/**
 * Returns the bar layout configuration for a specific monitor
 *
 * @param monitor - Monitor ID number
 * @param layouts - Object containing layout configurations for different monitors
 * @returns BarLayout configuration for the specified monitor, falling back to default if not found
 */
export const getLayoutForMonitor = (monitor: number, layouts: BarLayouts): BarLayout => {
    const [rootKey, rootLayout] = _getResolveLayoutForMonitor(monitor, layouts);

    let left = rootLayout.left;
    let middle = rootLayout.middle;
    let right = rootLayout.right;

    let layout = rootLayout;
    const visited = [rootKey];
    while (
        layout.extends !== undefined &&
        (left === undefined || middle === undefined || right === undefined)
    ) {
        if (visited.includes(layout.extends)) {
            console.error(`found circular reference in layout extensions: ${visited.join(' -> ')}`);
            return emptyBar;
        }
        visited.push(layout.extends);

        if (!(layout.extends in layouts)) {
            console.error(
                `failed to find layout with name '${layout.extends}' (resolved path: ${visited.join(' -> ')})`,
            );
            return emptyBar;
        }

        layout = layouts[layout.extends];

        if (left === undefined) {
            left = layout.left;
        }
        if (middle === undefined) {
            middle = layout.middle;
        }
        if (right === undefined) {
            right = layout.right;
        }
    }

    return {
        left: left ?? [],
        middle: middle ?? [],
        right: right ?? [],
    };
};

const _getResolveLayoutForMonitor = (monitor: number, layouts: BarLayouts): [string, BarLayout] => {
    const hyprlandService = AstalHyprland.get_default();
    const mon = hyprlandService.get_monitor(monitor);
    if (!mon) {
        return [
            'default',
            {
                left: ['dashboard', 'workspaces', 'windowtitle'],
                middle: ['media'],
                right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
            },
        ];
    }

    const monitorConn = mon.get_name();

    const matchingConn = Object.keys(layouts).find((key) => key === monitorConn);
    if (matchingConn !== undefined) {
        return [matchingConn, layouts[matchingConn]];
    }

    const matchingNum = Object.keys(layouts).find((key) => key === monitor.toString());
    if (matchingNum !== undefined) {
        return [matchingNum, layouts[matchingNum]];
    }

    const wildcard = Object.keys(layouts).find((key) => key === '*');
    if (wildcard) {
        return [wildcard, layouts[wildcard]];
    }

    return [
        'default',
        {
            left: ['dashboard', 'workspaces', 'windowtitle'],
            middle: ['media'],
            right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
        },
    ];
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
    const display = Gdk.Display.get_default();
    if (display === null) {
        console.error('[forMonitors] No display available');
        return [];
    }

    const monitorCount = display.get_n_monitors();
    const gdkMonitorService = GdkMonitorService.getInstance();
    const monitorMappings: MonitorMapping[] = [];

    for (let gdkMonitorIndex = 0; gdkMonitorIndex < monitorCount; gdkMonitorIndex++) {
        const monitor = display.get_monitor(gdkMonitorIndex);
        if (monitor === null) {
            console.warn(`[forMonitors] Skipping invalid monitor at index ${gdkMonitorIndex}`);
            continue;
        }

        const hyprlandId = gdkMonitorService.mapGdkToHyprland(gdkMonitorIndex);

        monitorMappings.push({
            gdkIndex: gdkMonitorIndex,
            hyprlandId,
        });
    }

    const monitorPromises = monitorMappings.map(async ({ gdkIndex, hyprlandId }) => {
        try {
            return await widget(gdkIndex, hyprlandId);
        } catch (error) {
            console.error(`[forMonitors] Failed to create widget for monitor ${gdkIndex}:`, error);
            return null;
        }
    });
    const widgets = await Promise.all(monitorPromises);

    return widgets.filter((w): w is JSXElement => w !== null);
}
