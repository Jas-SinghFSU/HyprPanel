import DropdownMenu from "../DropdownMenu.js";
import { activeDevices } from "./active/index.js";
import { availableDevices } from "./available/index.js";

export default () => {
  return DropdownMenu({
    name: "audiomenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items audio",
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        hexpand: true,
        class_name: "menu-items-container",
        children: [
          activeDevices(),
          availableDevices(),
        ],
      }),
    }),
  });
};
