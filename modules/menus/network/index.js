const network = await Service.import("network");
import DropdownMenu from "../DropdownMenu.js";
import { Ethernet } from "./Ethernet.js";
import { Wifi } from "./Wifi/index.js";

export default () => {
  return DropdownMenu({
    name: "networkmenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        hexpand: true,
        class_name: "menu-items-container network",
        children: [Ethernet(), Wifi()],
      }),
    }),
  });
};
