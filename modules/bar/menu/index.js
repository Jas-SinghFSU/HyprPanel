import { openMenu } from "../utils.js";

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
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "dashboardmenu");
      },
    },
  };
};

export { Menu };
