const network = await Service.import("network");
import { closeAllMenus } from "../index.js";

import { globalMousePos } from "../../../globals.js";

const Network = () => {
  const wifiIndicator = [
    Widget.Icon({
      icon: network.wifi.bind("icon_name"),
    }),
    Widget.Label({
      label: network.wifi
        .bind("ssid")
        .as((ssid) => (ssid ? `  ${ssid}` : "  --").substring(0, 7)),
    }),
  ];

  const wiredIndicator = [
    Widget.Label({
      label: network.bind("wired").as(() => "󰈀  Wired"),
    }),
  ];

  return {
    component: Widget.Box({
      vpack: "center",
      class_name: "bar-network",
      children: network
        .bind("primary")
        .as((w) => (w === "wired" ? wiredIndicator : wifiIndicator)),
    }),
    isVisible: true,
    props: {
      on_primary_click: (_, event) => {
        const clickPos = event.get_root_coords();
        const coords = [clickPos[1], clickPos[2]];

        globalMousePos.value = coords;

        closeAllMenus();
        App.toggleWindow("networkmenu");
      },
    },
  };
};

export { Network };
