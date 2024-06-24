import { Menu } from "./menu/index.js";
import { Workspaces } from "./workspaces/index.js";
import { ClientTitle } from "./window_title/index.js";
import { Media } from "./media/index.js";
import { Notification } from "./notification/index.js";
import { Volume } from "./volume/index.js";
import { Network } from "./network/index.js";
import { Bluetooth } from "./bluetooth/index.js";
import { BatteryLabel } from "./battery/index.js";
import { Clock } from "./clock/index.js"; 
import { SysTray } from "./systray/index.js";
import { Power } from "./power/index.js";

import { BarItemBox } from "../shared/barItemBox.js";

const closeAllMenus = () => {
  App.closeWindow("bluetoothmenu");
  App.closeWindow("audiomenu");
  App.closeWindow("networkmenu");
  App.closeWindow("mediamenu");
}

// layout of the bar
const Left = (monitor, wsMap) => {
  return Widget.Box({
    class_name: "box-left",
    hpack: "start",
    spacing: 5,
    children: [Menu(), BarItemBox(Workspaces(monitor, wsMap, 10)), BarItemBox(ClientTitle())],
  });
};

const Center = () => {
  return Widget.Box({
    class_name: "box-center",
    spacing: 5,
    children: [
      BarItemBox(Media()),
      // BarItemBox(Notification())
    ],
  });
};

const Right = () => {
  return Widget.Box({
    class_name: "box-right",
    hpack: "end",
    spacing: 5,
    children: [
      BarItemBox(Volume()),
      BarItemBox(Network()),
      BarItemBox(Bluetooth()),
      BarItemBox(BatteryLabel()),
      BarItemBox(SysTray()),
      BarItemBox(Clock()),
      BarItemBox(Power()),
    ],
  });
};

const LeftAlt = (monitor, wsMap) => {
  return Widget.Box({
    class_name: "box-left",
    hpack: "start",
    spacing: 5,
    children: [Menu(), BarItemBox(Workspaces(monitor, wsMap)), BarItemBox(ClientTitle())],
  });
};

const CenterAlt = () => {
  return Widget.Box({
    class_name: "box-center",
    spacing: 5,
    children: [
      BarItemBox(Media()),
      // BarItemBox(Notification())
    ],
  });
};

const RightAlt = () => {
  return Widget.Box({
    class_name: "box-right",
    hpack: "end",
    spacing: 5,
    children: [
      BarItemBox(Volume()),
      BarItemBox(Clock()),
      BarItemBox(Power()),
    ],
  });
};

const Bar = (monitor = 0, wsMap) => {
  return Widget.Window({
    name: `bar-${monitor}`,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Left(monitor, wsMap),
      center_widget: Center(),
      end_widget: Right(),
    }),
  });
};

const BarAlt = (monitor = 0, wsMap) => {
  return Widget.Window({
    name: `bar-${monitor}`,
    class_name: "bar",
    monitor,
    anchor: ["top", "left", "right"],
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: LeftAlt(monitor, wsMap),
      center_widget: CenterAlt(),
      end_widget: RightAlt(),
    }),
  });
};

export { Bar, BarAlt, closeAllMenus };
