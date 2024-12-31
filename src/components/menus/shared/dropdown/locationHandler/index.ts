import options from 'src/options';
import { globalEventBoxes } from 'src/globals/dropdown';
import { GLib } from 'astal';
import { EventBox } from 'astal/gtk3/widget';
import { hyprlandService } from 'src/lib/constants/services';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const { location } = options.theme.bar;
const { scalingPriority } = options;

/**
 * Retrieves the dropdown EventBox widget from the global event boxes map using the provided window name.
 *
 * @param windowName - A string identifier for the window whose EventBox you want to retrieve.
 * @returns The EventBox object if found; otherwise, `undefined`.
 */
function getDropdownEventBox(windowName: string): EventBox | undefined {
    return globalEventBoxes.get()[windowName];
}

/**
 * Finds and returns the currently focused Hyprland monitor object.
 *
 * @returns The focused Hyprland monitor, or `undefined` if no match is found.
 */
function getFocusedHyprlandMonitor(): AstalHyprland.Monitor | undefined {
    const allMonitors = hyprlandService.get_monitors();
    return allMonitors.find((monitor) => monitor.id === hyprlandService.focusedMonitor.id);
}

/**
 * Computes the scaled monitor dimensions based on user configuration and environment variables.
 *
 * This function applies:
 * 1. GDK scaling (from the `GDK_SCALE` environment variable).
 * 2. Hyprland scaling (from the monitor's scale).
 *
 * The order in which scaling is applied depends on `scalingPriority`:
 * - 'both': Apply GDK scale first, then Hyprland scale.
 * - 'gdk': Apply GDK scale only.
 * - Otherwise: Apply Hyprland scale only.
 *
 * @param width - The original width of the focused Hyprland monitor.
 * @param height - The original height of the focused Hyprland monitor.
 * @param monitorScaling - The scale factor reported by Hyprland for this monitor.
 * @returns An object containing `adjustedWidth` and `adjustedHeight` after scaling is applied.
 */
function applyMonitorScaling(width: number, height: number, monitorScaling: number): MonitorScaling {
    const gdkEnvScale = GLib.getenv('GDK_SCALE') || '1';
    const userScalingPriority = scalingPriority.get();

    let adjustedWidth = width;
    let adjustedHeight = height;

    if (userScalingPriority === 'both') {
        const gdkScaleValue = parseFloat(gdkEnvScale);
        adjustedWidth /= gdkScaleValue;
        adjustedHeight /= gdkScaleValue;

        adjustedWidth /= monitorScaling;
        adjustedHeight /= monitorScaling;
    } else if (/^\d+(\.\d+)?$/.test(gdkEnvScale) && userScalingPriority === 'gdk') {
        const gdkScaleValue = parseFloat(gdkEnvScale);
        adjustedWidth /= gdkScaleValue;
        adjustedHeight /= gdkScaleValue;
    } else {
        adjustedWidth /= monitorScaling;
        adjustedHeight /= monitorScaling;
    }

    return { adjustedWidth, adjustedHeight };
}

/**
 * Corrects monitor dimensions if the monitor is rotated (vertical orientation),
 * which requires swapping the width and height.
 *
 * @param monitorWidth - The monitor width after scaling.
 * @param monitorHeight - The monitor height after scaling.
 * @param isVertical - Whether the monitor transform indicates a vertical rotation.
 * @returns The appropriately adjusted width and height.
 */
function adjustForVerticalTransform(
    monitorWidth: number,
    monitorHeight: number,
    isVertical: boolean,
): TransformedDimensions {
    if (!isVertical) {
        return { finalWidth: monitorWidth, finalHeight: monitorHeight };
    }

    return { finalWidth: monitorHeight, finalHeight: monitorWidth };
}

/**
 * Calculates the left and right margins required to place the dropdown in the correct position
 * relative to the monitor width and the desired anchor X coordinate.
 *
 * @param monitorWidth - The width of the monitor (already scaled).
 * @param dropdownWidth - The width of the dropdown widget.
 * @param anchorX - The X coordinate (in scaled pixels) around which the dropdown should be placed.
 * @returns An object containing `leftMargin` and `rightMargin`, ensuring they do not go below 0.
 */
function calculateHorizontalMargins(monitorWidth: number, dropdownWidth: number, anchorX: number): HorizontalMargins {
    const minimumSpacing = 0;

    let rightMarginSpacing = monitorWidth - dropdownWidth / 2;
    rightMarginSpacing -= anchorX;

    let leftMarginSpacing = monitorWidth - dropdownWidth - rightMarginSpacing;

    if (rightMarginSpacing < minimumSpacing) {
        rightMarginSpacing = minimumSpacing;
        leftMarginSpacing = monitorWidth - dropdownWidth - minimumSpacing;
    }
    if (leftMarginSpacing < minimumSpacing) {
        leftMarginSpacing = minimumSpacing;
        rightMarginSpacing = monitorWidth - dropdownWidth - minimumSpacing;
    }

    return { leftMargin: leftMarginSpacing, rightMargin: rightMarginSpacing };
}

/**
 * Positions the dropdown vertically based on the global bar location setting.
 * If the bar is positioned at the top, the dropdown is placed at the top (margin_top = 0).
 * Otherwise, it's placed at the bottom.
 *
 * @param dropdownEventBox - The EventBox representing the dropdown.
 * @param monitorHeight - The scaled (and possibly swapped) monitor height.
 * @param dropdownHeight - The height of the dropdown widget.
 */
function setVerticalPosition(dropdownEventBox: EventBox, monitorHeight: number, dropdownHeight: number): void {
    if (location.get() === 'top') {
        dropdownEventBox.set_margin_top(0);
        dropdownEventBox.set_margin_bottom(monitorHeight);
    } else {
        dropdownEventBox.set_margin_bottom(0);
        dropdownEventBox.set_margin_top(monitorHeight - dropdownHeight);
    }
}

/**
 * Adjusts the position of a dropdown menu (event box) based on the focused monitor, scaling preferences,
 * and the bar location setting. It ensures the dropdown is accurately placed either at the top or bottom
 * of the screen within monitor boundaries, respecting both GDK scaling and Hyprland scaling.
 *
 * @param positionCoordinates - An array of `[x, y]` values representing the anchor position at which
 * the dropdown should ideally appear (only the X coordinate is used here).
 * @param windowName - A string that identifies the window in the globalEventBoxes map.
 *
 * @returns A Promise that resolves once the dropdown position is fully calculated and set.
 */
export const calculateMenuPosition = async (positionCoordinates: number[], windowName: string): Promise<void> => {
    try {
        const dropdownEventBox = getDropdownEventBox(windowName);

        if (!dropdownEventBox) {
            return;
        }

        const focusedHyprlandMonitor = getFocusedHyprlandMonitor();

        if (!focusedHyprlandMonitor) {
            return;
        }

        const dropdownWidth = dropdownEventBox.get_child()?.get_allocation().width ?? 0;
        const dropdownHeight = dropdownEventBox.get_child()?.get_allocation().height ?? 0;

        const monitorScaling = focusedHyprlandMonitor.scale || 1;
        const { width: rawMonitorWidth, height: rawMonitorHeight, transform } = focusedHyprlandMonitor;

        if (!rawMonitorWidth || !rawMonitorHeight) {
            return;
        }

        const { adjustedWidth, adjustedHeight } = applyMonitorScaling(
            rawMonitorWidth,
            rawMonitorHeight,
            monitorScaling,
        );

        const isVertical = transform !== undefined ? transform % 2 !== 0 : false;
        const { finalWidth, finalHeight } = adjustForVerticalTransform(adjustedWidth, adjustedHeight, isVertical);

        const { leftMargin, rightMargin } = calculateHorizontalMargins(
            finalWidth,
            dropdownWidth,
            positionCoordinates[0],
        );

        dropdownEventBox.set_margin_left(leftMargin);
        dropdownEventBox.set_margin_right(rightMargin);

        setVerticalPosition(dropdownEventBox, finalHeight, dropdownHeight);
    } catch (caughtError) {
        console.error(`Error getting menu position: ${caughtError}`);
    }
};

type HorizontalMargins = {
    leftMargin: number;
    rightMargin: number;
};

type MonitorScaling = {
    adjustedWidth: number;
    adjustedHeight: number;
};

type TransformedDimensions = {
    finalWidth: number;
    finalHeight: number;
};
