import { exec } from "resource:///com/github/Aylur/ags/utils.js";

const Menu = () => {
  return {
    component: Widget.Box({
      child: Widget.Label({
        class_name: "bar-menu_label",
        label: "󰣇",
      }),
    }),
    isVisible: true,
    props: {
      on_primary_click: () => exec("/home/jaskir/.config/hypr/scripts/rofi.sh"),
    },
  };
};

export { Menu };
