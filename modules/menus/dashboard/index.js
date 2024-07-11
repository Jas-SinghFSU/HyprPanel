import PopupWindow from "../PopupWindow.js";
import { Profile } from "./profile/index.js";
import { Shortcuts } from "./shortcuts/index.js";
import { Controls } from "./controls/index.js";
import { Stats } from "./stats/index.js";
import { Directories } from "./directories/index.js";

export default () => {
  return PopupWindow({
    name: "dashboardmenu",
    visible: false,
    transition: "crossfade",
    layout: "top-left",
    child: Widget.Box({
      class_name: "dashboard-menu-content",
      css: "padding: 1px; margin: -1px;",
      vexpand: false,
      children: [
        Widget.Box({
          class_name: "dashboard-content-container",
          vertical: true,
          children: [
            Widget.Box({
              class_name: "dashboard-content-items",
              vertical: true,
              children: [
                Profile(),
                Shortcuts(),
                Controls(),
                Directories(),
                Stats(),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
