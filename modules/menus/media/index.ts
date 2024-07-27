import DropdownMenu from "../DropdownMenu.js";
import { Media } from "./media.js";

export default () => {
  return DropdownMenu({
    name: "mediamenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items media",
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        class_name: "menu-items-container media",
        hpack: "fill",
        hexpand: true,
        child: Media(),
      }),
    }),
  });
};
