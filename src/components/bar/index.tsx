import { GdkMonitorMapper } from './utils/GdkMonitorMapper';
import { BarLayout } from './BarLayout';
import { WidgetRegistry } from './WidgetRegistry';
import { getCoreWidgets } from './CoreWidgets';

const gdkMonitorMapper = new GdkMonitorMapper();
const widgetRegistry = new WidgetRegistry(getCoreWidgets());

/**
 * Factory function to create a Bar for a specific monitor
 */
export const Bar = async (monitor: number): Promise<JSX.Element> => {
    await widgetRegistry.initialize();

    const hyprlandMonitor = gdkMonitorMapper.mapGdkToHyprland(monitor);
    const barLayout = new BarLayout(monitor, hyprlandMonitor, widgetRegistry);

    return barLayout.render();
};
