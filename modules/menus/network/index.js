const network = await Service.import("network");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  network.connect("changed", (value) => {
    console.log(JSON.stringify(value, null, 2));
  });

  return DropdownMenu({
    name: "networkmenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        hexpand: true,
        class_name: "menu-items-container network",
        children: [
          Widget.Box({
            class_name: "menu-dropdown-label-container",
            hpack: "start",
            children: [
              Widget.Label({
                class_name: "menu-dropdown-label network",
                label: "Networks",
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "menu-label-container network",
            child: Widget.Label({
              class_name: "menu-label network",
              hpack: "start",
              label: "Connected Network",
            }),
          }),
          Widget.Box({
            class_name: "menu-item-box network",
            vertical: true,
            setup: (self) => {
              self.hook(network, () => {
                let sortedNetworks = [];

                if (network.wifi.access_points.length > 0) {
                  sortedNetworks = network.wifi.access_points
                    .filter((ap) => ap.ssid !== "Unknown")
                    .sort((a, b) => {
                      if (a.ssid === network.wifi.ssid) {
                        return -1;
                      } else if (b.ssid === network.wifi.ssid) {
                        return 1;
                      } else {
                        return b.strength - a.strength;
                      }
                    });
                }

                const localIfConnected = () => {
                  if (network.primary === "wired") {
                    return Widget.Box({
                      class_name: `network-element-item-ethernet ${sortedNetworks.length > 0 ? "multi" : ""}`,
                      child: Widget.Box({
                        hpack: "start",
                        vertical: true,
                        children: [
                          Widget.Box({
                            class_name: "network-element-items-container",
                            children: [
                              Widget.Button({
                                class_name: "menu-button-icon network",
                                child: Widget.Icon({
                                  tooltip_text: network.wired.internet,
                                  icon: `${network.wired["icon_name"]}`,
                                }),
                              }),
                              Widget.Label({
                                class_name: "menu-button-name network",
                                truncate: "end",
                                wrap: true,
                                label: `Ethernet (${network.wired.speed / 1000} Gbps)`,
                              }),
                            ],
                          }),
                        ],
                      }),
                    });
                  }
                  return Widget.Box({});
                };
                return (self.child = localIfConnected());
              });
            },
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "menu-label-container network",
            child: Widget.Label({
              class_name: "menu-label network",
              hpack: "start",
              label: "Available Networks",
            }),
          }),
          Widget.Box({
            class_name: "menu-item-box network",
            vertical: true,
            setup: (self) => {
              self.hook(network, () => {
                // TODO: Finish dis

                let sortedNetworks = [];

                if (network.wifi.access_points.length > 0) {
                  sortedNetworks = network.wifi.access_points
                    .filter((ap) => ap.ssid !== "Unknown")
                    .sort((a, b) => {
                      if (a.ssid === network.wifi.ssid) {
                        return -1;
                      } else if (b.ssid === network.wifi.ssid) {
                        return 1;
                      } else {
                        return b.strength - a.strength;
                      }
                    });
                }

                console.log(sortedNetworks.length);

                return (self.children = sortedNetworks.map((curNetwork) => {
                  return Widget.Button({
                    class_name: "network-element-item",
                    child: Widget.Box({
                      children: [
                        Widget.Box({
                          hpack: "start",
                          vertical: true,
                          children: [
                            Widget.Box({
                              class_name: "network-element-items-container",
                              children: [
                                Widget.Button({
                                  class_name: "menu-button-icon network",
                                  child: Widget.Icon({
                                    tooltip_text:
                                      curNetwork.ssid === network.wifi.ssid
                                        ? network.wifi.state
                                        : null,
                                    icon: `${curNetwork["iconName"]}`,
                                  }),
                                }),
                                Widget.Label({
                                  class_name: "menu-button-name network",
                                  truncate: "end",
                                  wrap: true,
                                  label: curNetwork.ssid,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  });
                }));
              });
            },
          }),
        ],
      }),
    }),
  });
};
