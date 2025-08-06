import { JSXElement } from 'src/core/types';
import { BarLayout } from './layout/BarLayout';
import { getCoreWidgets } from './layout/coreWidgets';
import { WidgetRegistry } from './layout/WidgetRegistry';

const widgetRegistry = new WidgetRegistry(getCoreWidgets());

/**
 * Creates a bar widget for a specific monitor with proper error handling
 * to prevent crashes when monitors become invalid.
 *
 * @param gdkMonitor - The GDK monitor index where the bar will be displayed
 * @param hyprlandMonitor - The corresponding Hyprland monitor ID for workspace
 *                          filtering and layout assignment
 * @returns A JSX element representing the bar widget for the specified monitor
 */
export const Bar = async (gdkMonitor: number, hyprlandMonitor?: number): Promise<JSXElement> => {
    await widgetRegistry.initialize();

    const hyprlandId = hyprlandMonitor ?? gdkMonitor;
    const barLayout = new BarLayout(gdkMonitor, hyprlandId, widgetRegistry);

    return barLayout.render();
};
