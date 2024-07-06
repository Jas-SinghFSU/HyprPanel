const network = await Service.import("network");
import { renderWAPs } from "./WirelessAPs.js";
import { renderWapStaging } from "./APStaging.js";

const Staging = Variable({});
const Connecting = Variable("");

const searchInProgress = Variable(false);

const startRotation = () => {
  searchInProgress.value = true;
  setTimeout(() => {
    searchInProgress.value = false;
  }, 5 * 1000);
};

const Wifi = () => {
  return Widget.Box({
    class_name: "menu-section-container wifi",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        children: [
          Widget.Label({
            class_name: "menu-label",
            hexpand: true,
            hpack: "start",
            label: "Wi-Fi",
          }),
          Widget.Button({
            vpack: "center",
            hpack: "end",
            class_name: "menu-icon-button search network",
            on_primary_click: () => {
              startRotation();
              network.wifi.scan();
            },
            child: Widget.Icon({
              class_name: searchInProgress
                .bind("value")
                .as((v) => (v ? "spinning" : "")),
              icon: "view-refresh-symbolic",
            }),
          }),
        ],
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vertical: true,
        children: [
          Widget.Box({
            class_name: "wap-staging",
            setup: (self) => {
              renderWapStaging(self, network, Staging, Connecting);
            },
          }),
          Widget.Box({
            class_name: "available-waps",
            vertical: true,
            setup: (self) => {
              renderWAPs(self, network, Staging, Connecting);
            },
          }),
        ],
      }),
    ],
  });
};

export { Wifi };
