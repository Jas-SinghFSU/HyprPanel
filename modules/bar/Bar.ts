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
import options from "options";

const { start, center, end } = options.bar.layout;

export type BarWidget = keyof typeof widget;

const widget = {
  battery: () => WidgetContainer(BatteryLabel()),
  dashboard: () => WidgetContainer(Menu()),
  workspaces: (monitor) => WidgetContainer(Workspaces(monitor, 10)),
  windowtitle: () => WidgetContainer(ClientTitle()),
  media: () => WidgetContainer(Media()),
  notifications: () => WidgetContainer(Notifications()),
  volume: () => WidgetContainer(Volume()),
  network: () => WidgetContainer(Network()),
  bluetooth: () => WidgetContainer(Bluetooth()),
  clock: () => WidgetContainer(Clock()),
  systray: () => WidgetContainer(SysTray()),
};

export const Bar = (monitor: number) => {
  return Widget.Window({
    name: `bar-${monitor}`,
    class_name: "bar",
    monitor,
    visible: true,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      visible: true,
      startWidget: Widget.Box({
        class_name: "box-left",
        spacing: 5,
        hexpand: true,
        setup: self => {
          self.children = start.value.map(w => widget[w](monitor));
          self.hook(start, (self) => {
            self.children = start.value.map(w => widget[w](monitor));
          })
        },
      }),
      centerWidget: Widget.Box({
        class_name: "box-center",
        hpack: "center",
        spacing: 5,
        setup: self => {
          self.children = center.value.map(w => widget[w](monitor));
          self.hook(center, (self) => {
            self.children = center.value.map(w => widget[w](monitor));
          })
        },
      }),
      endWidget: Widget.Box({
        class_name: "box-right",
        hpack: "end",
        spacing: 5,
        setup: self => {
          self.children = end.value.map(w => widget[w](monitor));
          self.hook(end, (self) => {
            self.children = end.value.map(w => widget[w](monitor));
          })
        },
      }),
    })
  });
};
