import { closeAllMenus } from "../index.js";

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
      on_primary_click: (_, event) => {
        const clickPos = event.get_root_coords();
        const coords = [clickPos[1], clickPos[2]];

        globalMousePos.value = coords;

        closeAllMenus();
        App.toggleWindow("dashboardmenu");
      },
    },
  };
};

export { Menu };
