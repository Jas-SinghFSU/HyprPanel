import DropdownMenu from "../DropdownMenu.js";
import { Devices } from "./devices/index.js";

export default () => {
  return DropdownMenu({
    name: "bluetoothmenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items bluetooth",
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        hexpand: true,
        class_name: "menu-items-container bluetooth",
        child: Devices(),
      }),
    }),
  });
};
