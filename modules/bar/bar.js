import { Workspaces } from "./workspaces/index.js";
import { ClientTitle } from "./window_title/index.js";
import { Media } from "./media/index.js";
import { Notification } from "./notification/index.js";
import { Volume } from "./volume/index.js";
import { Bluetooth } from "./bluetooth/index.js";
import { BatteryLabel } from "./battery/index.js";
import { Clock } from "./clock/index.js";
import { SysTray } from "./systray/index.js";

import { BarItemBox } from "../shared/barItemBox.js";

// layout of the bar
const Left = () => {
  return Widget.Box({
    class_name: "box-left",
    hpack: "start",
    spacing: 5,
    children: [BarItemBox(Workspaces()), BarItemBox(ClientTitle())],
  });
};

const Center = () => {
  return Widget.Box({
    class_name: "box-center",
    spacing: 5,
    children: [BarItemBox(Media()), BarItemBox(Notification())],
  });
};

const Right = () => {
  return Widget.Box({
    class_name: "box-right",
    hpack: "end",
    spacing: 5,
    children: [
      BarItemBox(Volume()),
      BarItemBox(Bluetooth()),
      BarItemBox(BatteryLabel()),
      BarItemBox(SysTray()),
      BarItemBox(Clock()),
    ],
  });
};

const Bar = (monitor = 0) => {
  return Widget.Window({
    name: `bar-${monitor}`,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Left(),
      center_widget: Center(),
      end_widget: Right(),
    }),
  });
};

export { Bar };
