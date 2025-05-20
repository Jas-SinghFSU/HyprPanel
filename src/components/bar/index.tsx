import { GdkMonitorService } from 'src/services/display/monitor';
import { BarLayout } from './layout/BarLayout';
import { getCoreWidgets } from './layout/coreWidgets';
import { WidgetRegistry } from './layout/WidgetRegistry';

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
