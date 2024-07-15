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

import { BarItemBox as WidgetContainer } from "../shared/barItemBox.js";
import options from "options"

const { start, center, end } = options.bar.layout
const { transparent, position } = options.bar

export type BarWidget = keyof typeof widget

const widget = {
    battery: WidgetContainer(BatteryLabel()),
    dashboard: WidgetContainer(Menu()),
    workspaces: WidgetContainer(Workspaces()),
    windowtitle: WidgetContainer(ClientTitle()),
    media: WidgetContainer(Media()),
    notifications: WidgetContainer(Notifications()),
    volume: WidgetContainer(Volume()),
    network: WidgetContainer(Network()),
    bluetooth: WidgetContainer(Bluetooth()),
    clock: WidgetContainer(Clock()),
    systray: WidgetContainer(SysTray()),
    // expander: () => Widget.Box({ expand: true }),
}

export const Bar = (monitor: number) => Widget.Window({
    monitor,
    class_name: "bar",
    name: `bar${monitor}`,
    exclusivity: "exclusive",
    anchor: position.bind().as(pos => [pos, "right", "left"]),
    child: Widget.CenterBox({
        startWidget: Widget.Box({
            class_name: "box-left",
            spacing: 5,
            hexpand: true,
            children: start.bind().as(s => s.map(w => widget[w])),
        }),
        centerWidget: Widget.Box({
            class_name: "box-center",
            hpack: "center",
            spacing: 5,
            children: center.bind().as(c => c.map(w => widget[w])),
        }),
        endWidget: Widget.Box({
            class_name: "box-right",
            hexpand: true,
            spacing: 5,
            children: end.bind().as(e => e.map(w => widget[w])),
        }),
    }),
    setup: self => self.hook(transparent, () => {
        self.toggleClassName("transparent", transparent.value)
    }),
})
