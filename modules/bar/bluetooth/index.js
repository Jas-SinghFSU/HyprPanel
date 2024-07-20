const bluetooth = await Service.import('bluetooth')
import options from "options";
import { openMenu } from "../utils.js";

const Bluetooth = () => {
  const btIcon = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "󰂯" : "󰂲"),
    class_name: "bar-bt_icon",
  });

  const btText = Widget.Label({
    label: Utils.merge([bluetooth.bind("enabled"), options.bar.bluetooth.label.bind("value")], (btEnabled, showLabel) => {
      if (showLabel) {
        return btEnabled ? " On" : " Off"
      }
      return "";

    }),
    class_name: "bar-bt_label",
  });

  return {
    component: Widget.Box({
      class_name: "volume",
      children: [btIcon, btText],
    }),
    isVisible: true,
    boxClass: "bluetooth",
    props: {
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "bluetoothmenu");
      },
    },
  };

}

export { Bluetooth }
