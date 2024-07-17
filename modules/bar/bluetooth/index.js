const bluetooth = await Service.import('bluetooth')
import { openMenu } from "../utils.js";

const Bluetooth = () => {
  const btIcon = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "󰂯" : "󰂲"),
    class_name: "bar-bt_icon",
  });

  const btText = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? " On" : " Off"),
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
