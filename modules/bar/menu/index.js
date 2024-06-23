import { exec } from "resource:///com/github/Aylur/ags/utils.js";

export const Menu = () => {
  return Widget.Box({
    child: Widget.Button({
      on_primary_click: () => exec('/home/jaskir/.config/hypr/scripts/rofi.sh'),
      child: Widget.Label({
        class_name: "bar-menu_label",
        label: "󰣇",
      }),
    }),
  });
};
