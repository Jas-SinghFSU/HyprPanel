const audio = await Service.import("mpris");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  return DropdownMenu({
    name: "mediamenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-dropdown-label-container",
            hpack: "start",
            children: [
              Widget.Label({
                class_name: "menu-dropdown-label media",
                label: "Media",
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
        ],
      }),
    }),
  });
};
