const bluetooth = await Service.import('bluetooth')
import { closeAllMenus } from "../bar.js";

const Bluetooth = () => {
  const btIcon = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "󰂯 " : "󰂲 "),
    class_name: "bar-bt_icon",
  });

  const btText = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "On" : "Off"),
    class_name: "bar-bt_label",
  });

  return {
    component: Widget.Box({
      class_name: "volume",
      children: [btIcon, btText],
    }),
    isVisible: true,
    props: {
      on_primary_click: (_, event) => {
        const clickPos = event.get_root_coords();
        const coords = [clickPos[1], clickPos[2]];

        globalMousePos.value = coords;

        closeAllMenus();
        App.toggleWindow("bluetoothmenu");
      },
    },
  };

}

export { Bluetooth }
