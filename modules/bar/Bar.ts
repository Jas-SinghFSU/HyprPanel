import { Menu } from "./menu/index.js";
import { Workspaces } from "./workspaces/index.js";
import { ClientTitle } from "./window_title/index.js";
import { Media } from "./media/index.js";
import { Notifications } from "./notifications/index.js";
import { Volume } from "./volume/index.js";
import { Network } from "./network/index.js";
import { Bluetooth } from "./bluetooth/index.js";
import { BatteryLabel } from "./battery/index.js";
import { Clock } from "./clock/index.js";
import { SysTray } from "./systray/index.js";
const hyprland = await Service.import("hyprland");

import { BarItemBox as WidgetContainer } from "../shared/barItemBox.js";
import options from "options";
import Gdk from "gi://Gdk?version=3.0";

const { layouts } = options.bar;

export type BarWidget = keyof typeof widget;

type Section = "battery"
    | "dashboard"
    | "workspaces"
    | "windowtitle"
    | "media"
    | "notifications"
    | "volume"
    | "network"
    | "bluetooth"
    | "clock"
    | "systray";

type Layout = {
    left: Section[],
    middle: Section[],
    right: Section[],
}

type BarLayout = {
    [key: string]: Layout
}

const getModulesForMonitor = (monitor: number, curLayouts: BarLayout) => {
    const foundMonitor = Object.keys(curLayouts).find(mon => mon === monitor.toString());

    const defaultSetup: Layout = {
        left: [
            "dashboard",
            "workspaces",
            "windowtitle"
        ],
        middle: [
            "media"
        ],
        right: [
            "volume",
            "network",
            "bluetooth",
            "battery",
            "systray",
            "clock",
            "notifications"
        ]
    }

    if (foundMonitor === undefined) {
        return defaultSetup;
    }

    return curLayouts[foundMonitor];

}

const widget = {
    battery: () => WidgetContainer(BatteryLabel()),
    dashboard: () => WidgetContainer(Menu()),
    workspaces: (monitor: number) => WidgetContainer(Workspaces(monitor, 10)),
    windowtitle: () => WidgetContainer(ClientTitle()),
    media: () => WidgetContainer(Media()),
    notifications: () => WidgetContainer(Notifications()),
    volume: () => WidgetContainer(Volume()),
    network: () => WidgetContainer(Network()),
    bluetooth: () => WidgetContainer(Bluetooth()),
    clock: () => WidgetContainer(Clock()),
    systray: () => WidgetContainer(SysTray()),
};
function getGdkMonitors() {
    const display = Gdk.Display.get_default();

    if (display === null) {
        return;
    }
    const numGdkMonitors = display.get_n_monitors();
    const gdkMonitors = {};
    for (let i = 0; i < numGdkMonitors; i++) {
        const curMonitor = display.get_monitor(i);

        if (curMonitor === null) {
            return;
        }

        const model = curMonitor.get_model();
        gdkMonitors[i] = model;
    }
    return gdkMonitors;
}

const gdkMonitorIdToHyprlandId = (monitor: number): number => {
    const gdkMonitors = getGdkMonitors();
    console.log(getGdkMonitors());

    const gdkMonitorModel = gdkMonitors?.[monitor];
    if (gdkMonitors === undefined || gdkMonitorModel === undefined) {
        return monitor;
    }

    const hyprlandMonitor = hyprland.monitors.find(hypMon => hypMon.model === gdkMonitorModel);

    if (hyprlandMonitor === undefined) {
        return monitor
    }

    return hyprlandMonitor.id;

    //based off of the monitor number, get the name that gdk has for it

    //get that monitors id from hyprland itself

}

export const Bar = (monitor: number) => {
    // const monitor = gdkMonitorIdToHyprlandId(monitor);
    return Widget.Window({
        name: `bar-${monitor}`,
        class_name: "bar",
        monitor,
        visible: true,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.Box({
            class_name: 'bar-panel-container',
            child: Widget.CenterBox({
                class_name: 'bar-panel',
                css: 'padding: 1px',
                startWidget: Widget.Box({
                    class_name: "box-left",
                    hexpand: true,
                    setup: self => {
                        self.hook(layouts, (self) => {
                            const foundLayout = getModulesForMonitor(monitor, layouts.value as BarLayout)
                            // console.log(monitor);
                            // console.log(JSON.stringify(foundLayout, null, 2));
                            self.children = foundLayout.left.filter(mod => Object.keys(widget).includes(mod)).map(w => widget[w](monitor));
                        })
                    },
                }),
                centerWidget: Widget.Box({
                    class_name: "box-center",
                    hpack: "center",
                    setup: self => {
                        self.hook(layouts, (self) => {
                            const foundLayout = getModulesForMonitor(monitor, layouts.value as BarLayout)
                            self.children = foundLayout.middle.filter(mod => Object.keys(widget).includes(mod)).map(w => widget[w](monitor));
                        })
                    },
                }),
                endWidget: Widget.Box({
                    class_name: "box-right",
                    hpack: "end",
                    setup: self => {
                        self.hook(layouts, (self) => {
                            const foundLayout = getModulesForMonitor(monitor, layouts.value as BarLayout)
                            self.children = foundLayout.right.filter(mod => Object.keys(widget).includes(mod)).map(w => widget[w](monitor));
                        })
                    },
                }),
            })
        })
    });
};
