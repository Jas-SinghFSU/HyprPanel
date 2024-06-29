const network = await Service.import("network");
import { renderWAPs } from "./WirelessAPs.js";
import { renderWapStaging } from "./APStaging.js";

const Staging = Variable("none");

const Wifi = () => {
  return Widget.Box({
    class_name: "menu-section-container wifi",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "menu-label",
          hexpand: true,
          hpack: "center",
          label: "Wi-Fi",
        }),
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vertical: true,
        children: [
          Widget.Box({
            class_name: "wap-staging",
            setup: (self) => {
              renderWapStaging(self, Staging);
            },
          }),
          Widget.Box({
            class_name: "available-waps",
            vertical: true,
            setup: (self) => {
                renderWAPs(self, network);
            },
          }),
        ],
      }),
    ],
  });
};

export { Wifi };
