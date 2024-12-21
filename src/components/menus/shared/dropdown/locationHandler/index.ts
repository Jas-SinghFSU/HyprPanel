import AstalHyprland from 'gi://AstalHyprland?version=0.1';

import options from 'src/options';
import { bash } from 'src/lib/utils';
import { globalEventBoxes } from 'src/globals/dropdown';
import { GLib } from 'astal';
import { EventBox } from 'astal/gtk3/widget';

const hyprland = AstalHyprland.get_default();

const { location } = options.theme.bar;
const { scalingPriority } = options;

export const calculateMenuPosition = async (pos: number[], windowName: string): Promise<void> => {
    try {
        const self = globalEventBoxes.get()[windowName] as EventBox;

        const curHyprlandMonitor = hyprland.get_monitors().find((m) => m.id === hyprland.focusedMonitor.id);

        const dropdownWidth = self.get_child()?.get_allocation().width ?? 0;
        const dropdownHeight = self.get_child()?.get_allocation().height ?? 0;

        let hyprScaling = 1;
        const monitorInfo = await bash('hyprctl monitors -j');
        const parsedMonitorInfo = JSON.parse(monitorInfo);

        const foundMonitor = parsedMonitorInfo.find(
            (monitor: AstalHyprland.Monitor) => monitor.id === hyprland.focusedMonitor.id,
        );
        hyprScaling = foundMonitor?.scale || 1;

        let monWidth = curHyprlandMonitor?.width;
        let monHeight = curHyprlandMonitor?.height;

        if (monWidth === undefined || monHeight === undefined || hyprScaling === undefined) {
            return;
        }

        // If GDK Scaling is applied, then get divide width by scaling
        // to get the proper coordinates.
        // Ex: On a 2860px wide monitor... if scaling is set to 2, then the right
        // end of the monitor is the 1430th pixel.
        const gdkScale = GLib.getenv('GDK_SCALE') || '1';

        if (scalingPriority.get() === 'both') {
            const scale = parseFloat(gdkScale);
            monWidth = monWidth / scale;
            monHeight = monHeight / scale;

            monWidth = monWidth / hyprScaling;
            monHeight = monHeight / hyprScaling;
        } else if (/^\d+(.\d+)?$/.test(gdkScale) && scalingPriority.get() === 'gdk') {
            const scale = parseFloat(gdkScale);
            monWidth = monWidth / scale;
            monHeight = monHeight / scale;
        } else {
            monWidth = monWidth / hyprScaling;
            monHeight = monHeight / hyprScaling;
        }

        // If monitor is vertical (transform = 1 || 3) swap height and width
        const isVertical = curHyprlandMonitor?.transform !== undefined ? curHyprlandMonitor.transform % 2 !== 0 : false;

        if (isVertical) {
            [monWidth, monHeight] = [monHeight, monWidth];
        }

        let marginRight = monWidth - dropdownWidth / 2;
        marginRight = marginRight - pos[0];
        let marginLeft = monWidth - dropdownWidth - marginRight;

        const minimumMargin = 0;

        if (marginRight < minimumMargin) {
            marginRight = minimumMargin;
            marginLeft = monWidth - dropdownWidth - minimumMargin;
        }

        if (marginLeft < minimumMargin) {
            marginLeft = minimumMargin;
            marginRight = monWidth - dropdownWidth - minimumMargin;
        }

        self.set_margin_left(marginLeft);
        self.set_margin_right(marginRight);

        if (location.get() === 'top') {
            self.set_margin_top(0);
            self.set_margin_bottom(monHeight);
        } else {
            self.set_margin_bottom(0);
            self.set_margin_top(monHeight - dropdownHeight);
        }
    } catch (error) {
        console.error(`Error getting menu position: ${error}`);
    }
};
