import { Gdk } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { BarLayout, BarLayouts } from 'src/lib/types/options';

const hyprlandService = AstalHyprland.get_default();

type GdkMonitors = {
    [key: string]: {
        key: string;
        model: string;
        used: boolean;
    };
};

export const getLayoutForMonitor = (monitor: number, layouts: BarLayouts): BarLayout => {
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

export const isLayoutEmpty = (layout: BarLayout): boolean => {
    const isLeftSectionEmpty = !Array.isArray(layout.left) || layout.left.length === 0;
    const isRightSectionEmpty = !Array.isArray(layout.right) || layout.right.length === 0;
    const isMiddleSectionEmpty = !Array.isArray(layout.middle) || layout.middle.length === 0;

    return isLeftSectionEmpty && isRightSectionEmpty && isMiddleSectionEmpty;
};

export function getGdkMonitors(): GdkMonitors {
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

        // We can only use the scaleFactor for a scale variable in the key
        // GDK3 doesn't support the fractional "scale" attribute (available in GDK4)
        const key = `${model}_${geometry.width}x${geometry.height}_${scaleFactor}`;
        gdkMonitors[i] = { key, model, used: false };
    }

    return gdkMonitors;
}

export function matchMonitorKey(hypMon: Set, gdkMonitor: Set): boolean {
    const transform = hypMon?.transform !== undefined ? 0 : hypMon.transform;
    const isRotated90 = transform % 2 !== 0;

    // Needed for the key regardless of scaling below because GDK3 only has the scale factor for the key
    const gdkScaleFactor = Math.ceil(hypMon.scale);

    // When gdk is scaled with the scale factor, the hyprland width/height will be the same as the base monitor resolution
    // The GDK width/height will NOT flip regardless of transformation (e.g. 90 degrees will NOT swap the GDK width/height) 
    const scaleFactorWidth = Math.trunc(hypMon.width / gdkScaleFactor);
    const scaleFactorHeight = Math.trunc(hypMon.height / gdkScaleFactor);
    const scaleFactorKey = `${hypMon.model}_${scaleFactorWidth}x${scaleFactorHeight}_${gdkScaleFactor}`;

    // When gdk geometry is scaled with the fractional scale, we need to scale the hyprland geometry to match it
    // However a 90 degree transformation WILL flip the GDK width/height 
    const transWidth = isRotated90 ? hypMon.height : hypMon.width;
    const transHeight = isRotated90 ? hypMon.width : hypMon.height;
    const scaleWidth = Math.trunc(transWidth / hypMon.scale);
    const scaleHeight = Math.trunc(transHeight / hypMon.scale);
    const scaleKey = `${hypMon.model}_${scaleWidth}x${scaleHeight}_${gdkScaleFactor}`;

    // In GDK3 the GdkMonitor geometry can change depending on how the compositor handles scaling surface framebuffers
    // We try to match against two different possibilities:
    //  1) The geometry is scaled by the correct fractional scale
    //  2) The geometry is scaled by the scaleFactor (the fractional scale rounded up)
    const keyMatch = gdkMonitor.key === scaleFactorKey || gdkMonitor.key === scaleKey;
    
    // Adding debug logging
    console.log('Attempting gdk key match');
    console.log(`GDK key: ${gdkMonitor.key}`);
    console.log(`HypMon.width: ${hypMon.width}`);
    console.log(`HypMon.height: ${hypMon.height}`);
    console.log(`HypMon.scale: ${hypMon.scale}`);
    console.log(`HypMon.transform: ${hypMon.transform}`);
    console.log(`isRotated90: ${isRotated90}`);
    console.log(`scaleFactor: ${gdkScaleFactor}`);
    console.log(`scaleFactorKey: ${scaleFactorKey}`);
    console.log(`scaleKey: ${scaleKey}`);
    console.log(`match?: ${keyMatch}`);

    return keyMatch
};

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

export const gdkMonitorIdToHyprlandId = (monitor: number, usedHyprlandMonitors: Set<number>): number => {

    const gdkMonitors = getGdkMonitors();

    if (Object.keys(gdkMonitors).length === 0) {
        return monitor;
    }

    // Get the GDK monitor for the given monitor index
    const gdkMonitor = gdkMonitors[monitor];

    // First pass: Strict matching including the monitor index (i.e., hypMon.id === monitor + resolution+scale criteria)
    const directMatch = hyprlandService.get_monitors().find((hypMon) => {
        return matchMonitorKey(hypMon, gdkMonitor) && !usedHyprlandMonitors.has(hypMon.id) && hypMon.id === monitor;
    });

    if (directMatch) {
        usedHyprlandMonitors.add(directMatch.id);
        return directMatch.id;
    }

    // Second pass: Relaxed matching without considering the monitor index
    const hyprlandMonitor = hyprlandService.get_monitors().find((hypMon) => {
        return matchMonitorKey(hypMon, gdkMonitor) && !usedHyprlandMonitors.has(hypMon.id);
    });

    if (hyprlandMonitor) {
        usedHyprlandMonitors.add(hyprlandMonitor.id);
        return hyprlandMonitor.id;
    }

    // Fallback: Find the first available monitor ID that hasn't been used
    const fallbackMonitor = hyprlandService.get_monitors().find((hypMon) => !usedHyprlandMonitors.has(hypMon.id));

    if (fallbackMonitor) {
        usedHyprlandMonitors.add(fallbackMonitor.id);
        return fallbackMonitor.id;
    }

    // Ensure we return a valid monitor ID that actually exists
    for (let i = 0; i < hyprlandService.get_monitors().length; i++) {
        if (!usedHyprlandMonitors.has(i)) {
            usedHyprlandMonitors.add(i);
            return i;
        }
    }

    // As a last resort, return the original monitor index if no unique monitor can be found
    console.warn(`Returning original monitor index as a last resort: ${monitor}`);
    return monitor;
};
