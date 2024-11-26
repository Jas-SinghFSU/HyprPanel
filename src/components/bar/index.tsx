import {
    Menu,
    // Workspaces,
    // ClientTitle,
    // Media,
    // Notifications,
    // Volume,
    // Network,
    // Bluetooth,
    // BatteryLabel,
    // Clock,
    // SysTray,
    //
    // // Custom Modules
    // Ram,
    // Cpu,
    // CpuTemp,
    // Storage,
    // Netstat,
    // KbInput,
    // Updates,
    // Submap,
    // Weather,
    // Power,
    // Hyprsunset,
    // Hypridle,
} from './exports';

import { BarItemBox as WidgetContainer } from 'src/components/bar/utils/barItemBox';
import options from 'src/options';
import { Gdk, Widget } from 'astal/gtk3/index';

import { BarLayout, BarLayouts } from '../../lib/types/options';
import { GtkWidget } from '../../lib/types/widget';
import Astal from 'gi://Astal?version=3.0';
import { hyprland } from 'src/lib/constants/hyprland';
import { bind, Variable } from 'astal';

const { layouts } = options.bar;
// const { location } = options.theme.bar;
const { location: borderLocation } = options.theme.bar.border;

const getLayoutForMonitor = (monitor: number, layouts: BarLayouts): BarLayout => {
    const matchingKey = Object.keys(layouts).find((key) => key === monitor.toString());
    const wildcard = Object.keys(layouts).find((key) => key === '*');

    if (matchingKey) {
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

const isLayoutEmpty = (layout: BarLayout): boolean => {
    const isLeftSectionEmpty = !Array.isArray(layout.left) || layout.left.length === 0;
    const isRightSectionEmpty = !Array.isArray(layout.right) || layout.right.length === 0;
    const isMiddleSectionEmpty = !Array.isArray(layout.middle) || layout.middle.length === 0;

    return isLeftSectionEmpty && isRightSectionEmpty && isMiddleSectionEmpty;
};

const widget = {
    // battery: (): GtkWidget => WidgetContainer(BatteryLabel()),
    dashboard: (): GtkWidget => WidgetContainer(Menu()),
    // workspaces: (monitor: number): GtkWidget => WidgetContainer(Workspaces(monitor)),
    // windowtitle: (): GtkWidget => WidgetContainer(ClientTitle()),
    // media: (): GtkWidget => WidgetContainer(Media()),
    // notifications: (): GtkWidget => WidgetContainer(Notifications()),
    // volume: (): GtkWidget => WidgetContainer(Volume()),
    // network: (): GtkWidget => WidgetContainer(Network()),
    // bluetooth: (): GtkWidget => WidgetContainer(Bluetooth()),
    // clock: (): GtkWidget => WidgetContainer(Clock()),
    // systray: (): GtkWidget => WidgetContainer(SysTray()),
    // ram: (): GtkWidget => WidgetContainer(Ram()),
    // cpu: (): GtkWidget => WidgetContainer(Cpu()),
    // cputemp: (): GtkWidget => WidgetContainer(CpuTemp()),
    // storage: (): GtkWidget => WidgetContainer(Storage()),
    // netstat: (): GtkWidget => WidgetContainer(Netstat()),
    // kbinput: (): GtkWidget => WidgetContainer(KbInput()),
    // updates: (): GtkWidget => WidgetContainer(Updates()),
    // submap: (): GtkWidget => WidgetContainer(Submap()),
    // weather: (): GtkWidget => WidgetContainer(Weather()),
    // power: (): GtkWidget => WidgetContainer(Power()),
    // hyprsunset: (): GtkWidget => WidgetContainer(Hyprsunset()),
    // hypridle: (): GtkWidget => WidgetContainer(Hypridle()),
};

type GdkMonitors = {
    [key: string]: {
        key: string;
        model: string;
        used: boolean;
    };
};

function getGdkMonitors(): GdkMonitors {
    const display = Gdk.Display.get_default();

    if (display === null) {
        console.error('Failed to get Gdk display.');
        return {};
    }

    const numGdkMonitors = display.get_n_monitors();
    const gdkMonitors: GdkMonitors = {};

    for (let i = 0; i < numGdkMonitors; i++) {
        const curMonitor = display.get_monitor(i);

        if (curMonitor === null) {
            console.warn(`Monitor at index ${i} is null.`);
            continue;
        }

        const model = curMonitor.get_model() || '';
        const geometry = curMonitor.get_geometry();
        const scaleFactor = curMonitor.get_scale_factor();

        const key = `${model}_${geometry.width}x${geometry.height}_${scaleFactor}`;
        gdkMonitors[i] = { key, model, used: false };
    }

    return gdkMonitors;
}

/**
 * NOTE: Some more funky stuff being done by GDK.
 * We render windows/bar based on the monitor ID. So if you have 3 monitors, then your
 * monitor IDs will be [0, 1, 2]. Hyprland will NEVER change what ID belongs to what monitor.
 *
 * So if hyprland determines id 0 = DP-1, even after you unplug, shut off or restart your monitor,
 * the id 0 will ALWAYS be DP-1.
 *
 * However, GDK (the righteous genius that it is) will change the order of ID anytime your monitor
 * setup is changed. So if you unplug your monitor and plug it back it, it now becomes the last id.
 * So if DP-1 was id 0 and you unplugged it, it will reconfigure to id 2. This sucks because now
 * there's a mismtach between what GDK determines the monitor is at id 2 and what Hyprland determines
 * is at id 2.
 *
 * So for that reason, we need to redirect the input `monitor` that the Bar module takes in, to the
 * proper Hyprland monitor. So when monitor id 0 comes in, we need to find what the id of that monitor
 * is being determined as by Hyprland so the bars show up on the right monitors.
 *
 * Since GTK3 doesn't contain connection names and only monitor models, we have to make the best guess
 * in the case that there are multiple models in the same resolution with the same scale. We find the
 * 'right' monitor by checking if the model matches along with the resolution and scale. If monitor at
 * ID 0 for GDK is being reported as 'MSI MAG271CQR' we find the same model in the Hyprland monitor list
 * and check if the resolution and scaling is the same... if it is then we determine it's a match.
 *
 * The edge-case that we just can't handle is if you have the same monitors in the same resolution at the same
 * scale. So if you've got 2 'MSI MAG271CQR' monitors at 2560x1440 at scale 1, then we just match the first
 * monitor in the list as the first match and then the second 'MSI MAG271CQR' as a match in the 2nd iteration.
 * You may have the bar showing up on the wrong one in this case because we don't know what the connector id
 * is of either of these monitors (DP-1, DP-2) which are unique values - as these are only in GTK4.
 *
 * Keep in mind though, this is ONLY an issue if you change your monitor setup by plugging in a new one, restarting
 * an existing one or shutting it off.
 *
 * If your monitors aren't changed in the current session you're in then none of this safeguarding is relevant.
 *
 * Fun stuff really... :facepalm:
 */

const gdkMonitorIdToHyprlandId = (monitor: number, usedHyprlandMonitors: Set<number>): number => {
    console.log(monitor);

    const gdkMonitors = getGdkMonitors();
    console.log(gdkMonitors);

    if (Object.keys(gdkMonitors).length === 0) {
        console.error('No GDK monitors were found.');
        return monitor;
    }

    // Get the GDK monitor for the given monitor index
    const gdkMonitor = gdkMonitors[monitor];
    console.log(gdkMonitor);

    // First pass: Strict matching including the monitor index (i.e., hypMon.id === monitor + resolution+scale criteria)
    const directMatch = hyprland.get_monitors().find((hypMon) => {
        const hyprlandKey = `${hypMon.model}_${hypMon.width}x${hypMon.height}_${hypMon.scale}`;
        return gdkMonitor.key.startsWith(hyprlandKey) && !usedHyprlandMonitors.has(hypMon.id) && hypMon.id === monitor;
    });

    if (directMatch) {
        usedHyprlandMonitors.add(directMatch.id);
        return directMatch.id;
    }

    // Second pass: Relaxed matching without considering the monitor index
    const hyprlandMonitor = hyprland.get_monitors().find((hypMon) => {
        const hyprlandKey = `${hypMon.model}_${hypMon.width}x${hypMon.height}_${hypMon.scale}`;
        return gdkMonitor.key.startsWith(hyprlandKey) && !usedHyprlandMonitors.has(hypMon.id);
    });

    if (hyprlandMonitor) {
        usedHyprlandMonitors.add(hyprlandMonitor.id);
        return hyprlandMonitor.id;
    }

    // Fallback: Find the first available monitor ID that hasn't been used
    const fallbackMonitor = hyprland.get_monitors().find((hypMon) => !usedHyprlandMonitors.has(hypMon.id));

    if (fallbackMonitor) {
        usedHyprlandMonitors.add(fallbackMonitor.id);
        return fallbackMonitor.id;
    }

    // Ensure we return a valid monitor ID that actually exists
    for (let i = 0; i < hyprland.get_monitors().length; i++) {
        if (!usedHyprlandMonitors.has(i)) {
            usedHyprlandMonitors.add(i);
            return i;
        }
    }

    // As a last resort, return the original monitor index if no unique monitor can be found
    console.warn(`Returning original monitor index as a last resort: ${monitor}`);
    return monitor;
};

export const Bar = (() => {
    const usedHyprlandMonitors = new Set<number>();

    return (monitor: number): GtkWidget => {
        const hyprlandMonitor = gdkMonitorIdToHyprlandId(monitor, usedHyprlandMonitors);

        const computeVisibility = bind(layouts).as(() => {
            const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
            return !isLayoutEmpty(foundLayout);
        });

        const computeAnchor = bind(options.theme.bar.location).as((loc) => {
            if (loc === 'bottom') {
                return Astal.WindowAnchor.BOTTOM;
            }

            return Astal.WindowAnchor.TOP;
        });

        const computeLayer = Variable.derive([bind(options.theme.bar.layer), bind(options.tear)], (barLayer, tear) => {
            if (tear && barLayer === 'overlay') {
                return Astal.Layer.TOP;
            }
            return Astal.Layer.OVERLAY;
        });

        return (
            <window
                name={`bar-${hyprlandMonitor}`}
                className={'bar'}
                monitor={monitor}
                visible={computeVisibility}
                anchor={computeAnchor}
                layer={computeLayer}
            ></window>
        );

        return new Widget.Window({
            name: `bar-${hyprlandMonitor}`,
            className: 'bar',
            monitor,
            // anchor: location.bind().as((ln) => [ln, 'left', 'right']),
            // exclusivity: 'exclusive',
            // layer: Utils.merge(
            //     [options.theme.bar.layer.bind(), options.tear.bind()],
            //     (barLayer: WindowLayer, tear: boolean) => {
            //         if (tear && barLayer === 'overlay') {
            //             return 'top';
            //         }
            //         return barLayer;
            //     },
            // ),
            anchor: Astal.WindowAnchor.TOP,
            exclusivity: Astal.Exclusivity.EXCLUSIVE,
            layer: Astal.Layer.TOP,
            child: new Widget.Box({
                className: 'bar-panel-container',
                child: new Widget.CenterBox({
                    className: borderLocation
                        .bind()
                        .as((brdrLcn) => (brdrLcn !== 'none' ? 'bar-panel withBorder' : 'bar-panel')),
                    css: 'padding: 1px',
                    startWidget: new Widget.Box({
                        className: 'box-left',
                        hexpand: true,
                        setup: (self: GtkWidget): void => {
                            self.hook(layouts, (self: GtkWidget) => {
                                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
                                self.children = foundLayout.left
                                    .filter((mod) => Object.keys(widget).includes(mod))
                                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
                            });
                        },
                    }),
                    centerWidget: new Widget.Box({
                        className: 'box-center',
                        // hpack: 'center',
                        setup: (self: GtkWidget): void => {
                            self.hook(layouts, (self: GtkWidget) => {
                                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
                                self.children = foundLayout.middle
                                    .filter((mod) => Object.keys(widget).includes(mod))
                                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
                            });
                        },
                    }),
                    endWidget: new Widget.Box({
                        className: 'box-right',
                        // hpack: 'end',
                        setup: (self: GtkWidget): void => {
                            self.hook(layouts, (self: GtkWidget) => {
                                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
                                self.children = foundLayout.right
                                    .filter((mod) => Object.keys(widget).includes(mod))
                                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
                            });
                        },
                    }),
                }),
            }),
        });
    };
})();
