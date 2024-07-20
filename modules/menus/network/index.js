import DropdownMenu from "../DropdownMenu.js";
import { Ethernet } from "./ethernet/index.js";
import { Wifi } from "./wifi/index.js";

export default () => {
  return DropdownMenu({
    name: "networkmenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items network",
      child: Widget.Box({
        vertical: true,
        hexpand: true,
        class_name: "menu-items-container network",
        children: [Ethernet(), Wifi()],
      }),
    }),
  });
};
