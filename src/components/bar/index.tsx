import { GdkMonitorService } from 'src/services';
import { BarLayout, getCoreWidgets, WidgetRegistry } from './layout';

const gdkMonitorService = new GdkMonitorService();
const widgetRegistry = new WidgetRegistry(getCoreWidgets());

/**
 * Factory function to create a Bar for a specific monitor
 */
export const Bar = async (monitor: number): Promise<JSX.Element> => {
    await widgetRegistry.initialize();

    const hyprlandMonitor = gdkMonitorService.mapGdkToHyprland(monitor);
    const barLayout = new BarLayout(monitor, hyprlandMonitor, widgetRegistry);

    return barLayout.render();
};
