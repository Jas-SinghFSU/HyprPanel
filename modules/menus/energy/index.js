import DropdownMenu from "../DropdownMenu.js";
import { EnergyProfiles } from "./profiles/index.js";
import { Brightness } from "./brightness/index.js";

export default () => {
  return DropdownMenu({
    name: "energymenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items energy",
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        hexpand: true,
        class_name: "menu-items-container energy",
        children: [
          Brightness(),
          EnergyProfiles(),
        ],
      }),
    }),
  });
};
