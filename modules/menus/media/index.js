import PopupWindow from "../PopupWindow.js";
import { Media } from "./media.js";

export default () => {
  return PopupWindow({
    name: "mediamenu",
    layout: "top-center",
    visible: false,
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
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
