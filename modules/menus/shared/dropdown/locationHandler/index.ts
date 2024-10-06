const hyprland = await Service.import('hyprland');

import options from 'options';
import { bash } from 'lib/utils';
import { Widget as TWidget } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';
import { Monitor } from 'types/service/hyprland';
import Box from 'types/widgets/box';
import EventBox from 'types/widgets/eventbox';
import Revealer from 'types/widgets/revealer';
import { globalEventBoxes } from 'globals/dropdown';

type NestedRevealer = Revealer<Box<TWidget, unknown>, unknown>;
type NestedBox = Box<NestedRevealer, unknown>;
type NestedEventBox = EventBox<NestedBox, unknown>;

const { location } = options.theme.bar;
const { scalingPriority } = options;

export const calculateMenuPosition = async (pos: number[], windowName: string): Promise<void> => {
    const self = globalEventBoxes.value[windowName] as NestedEventBox;
    const curHyprlandMonitor = hyprland.monitors.find((m) => m.id === hyprland.active.monitor.id);
    const dropdownWidth = self.child.get_allocation().width;
    const dropdownHeight = self.child.get_allocation().height;

    let hyprScaling = 1;
    try {
        const monitorInfo = await bash('hyprctl monitors -j');
        const parsedMonitorInfo = JSON.parse(monitorInfo);

        const foundMonitor = parsedMonitorInfo.find((monitor: Monitor) => monitor.id === hyprland.active.monitor.id);
        hyprScaling = foundMonitor?.scale || 1;
    } catch (error) {
        console.error(`Error parsing hyprland monitors: ${error}`);
    }

    let monWidth = curHyprlandMonitor?.width;
    let monHeight = curHyprlandMonitor?.height;

    if (monWidth === undefined || monHeight === undefined || hyprScaling === undefined) {
        return;
    }

    // If GDK Scaling is applied, then get divide width by scaling
    // to get the proper coordinates.
    // Ex: On a 2860px wide monitor... if scaling is set to 2, then the right
    // end of the monitor is the 1430th pixel.
    const gdkScale = Utils.exec('bash -c "echo $GDK_SCALE"');

    if (scalingPriority.value === 'both') {
        const scale = parseFloat(gdkScale);
        monWidth = monWidth / scale;
        monHeight = monHeight / scale;

        monWidth = monWidth / hyprScaling;
        monHeight = monHeight / hyprScaling;
    } else if (/^\d+(.\d+)?$/.test(gdkScale) && scalingPriority.value === 'gdk') {
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

    if (location.value === 'top') {
        self.set_margin_top(0);
        self.set_margin_bottom(monHeight);
    } else {
        self.set_margin_bottom(0);
        self.set_margin_top(monHeight - dropdownHeight);
    }
};
