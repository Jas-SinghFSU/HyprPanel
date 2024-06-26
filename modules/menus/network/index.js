const network = await Service.import("network");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  const pendingAuth = Variable("");

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
                self.hook(pendingAuth, () => {
                  let sortedNetworks = [];

                  if (network.wifi.access_points.length > 0) {
                    sortedNetworks = network.wifi.access_points
                      .filter((ap) => ap.ssid !== "Unknown")
                      .sort((a, b) => {
                        return b.strength - a.strength;
                      });
                  }

                  const localIfConnected = () => {
                    if (network.primary === "wired") {
                      return [
                        Widget.Box({
                          class_name: `network-element-item-ethernet ${sortedNetworks.length > 0 ? "multi" : ""}`,
                          child: Widget.Box({
                            hpack: "start",
                            vertical: true,
                            children: [
                              Widget.Box({
                                children: [
                                  Widget.Box({
                                    class_name:
                                      "network-element-items-container",
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
                              Widget.Box({
                                class_name:
                                  "menu-button-name-container status dim",
                                children: [
                                  Widget.Label({
                                    class_name:
                                      "menu-button-name status network dim",
                                    label:
                                      network.wired.internet
                                        .charAt(0)
                                        .toUpperCase() +
                                      network.wired.internet.slice(1),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ];
                    }
                    return [];
                  };

                  const wifiIfConnected = () => {
                    const getIdBySsid = (ssid, nmcliOutput) => {
                      const lines = nmcliOutput.trim().split("\n");
                      for (const line of lines) {
                        const columns = line.trim().split(/\s{2,}/);
                        if (columns[0].includes(ssid)) {
                          return columns[1];
                        }
                      }
                      return null;
                    };

                    if (network.wifi.ssid !== "") {
                      return [
                        Widget.Box({
                          class_name: `network-element-item-ethernet`,
                          children: [
                            Widget.Box({
                              hpack: "start",
                              vertical: true,
                              children: [
                                Widget.Box({
                                  children: [
                                    Widget.Box({
                                      class_name:
                                        "network-element-items-container",
                                      children: [
                                        Widget.Button({
                                          class_name:
                                            "menu-button-icon network",
                                          child: Widget.Icon({
                                            tooltip_text: network.wifi.state,
                                            icon: `${network.wifi["icon_name"]}`,
                                          }),
                                        }),
                                        Widget.Label({
                                          class_name:
                                            "menu-button-name network",
                                          truncate: "end",
                                          wrap: true,
                                          label: network.wifi.ssid,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                Widget.Box({
                                  class_name:
                                    "menu-button-name-container status dim",
                                  children: [
                                    Widget.Label({
                                      class_name:
                                        "menu-button-name status network dim",
                                      label:
                                        network.wifi.internet
                                          .charAt(0)
                                          .toUpperCase() +
                                        network.wifi.internet.slice(1),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            Widget.Box({
                              hexpand: true,
                              hpack: "end",
                              children: [
                                Widget.Button({
                                  class_name:
                                    "menu-icon-button network disconnect",
                                  on_primary_click: () => {
                                    Utils.execAsync(
                                      "nmcli connection show --active",
                                    ).then((res) => {
                                      const connectionId = getIdBySsid(
                                        network.wifi.ssid,
                                        res,
                                      );

                                      Utils.execAsync(
                                        `nmcli connection down ${connectionId} "${network.wifi.ssid}"`,
                                      ).catch((err) =>
                                        console.error(
                                          `Error while disconnecting from wifi "${network.wifi.ssid}": ${err}`,
                                        ),
                                      );
                                    });
                                  },
                                  child: Widget.Label(""),
                                }),
                                Widget.Box({
                                  hexpand: true,
                                  child: Widget.Button({
                                    class_name:
                                      "menu-icon-button network forget",
                                    on_primary_click: () => {
                                      Utils.execAsync(
                                        "nmcli connection show --active",
                                      ).then((res) => {
                                        const connectionId = getIdBySsid(
                                          network.wifi.ssid,
                                          res,
                                        );

                                        Utils.execAsync(
                                          `nmcli connection delete ${connectionId} "${network.wifi.ssid}"`,
                                        ).catch((err) =>
                                          console.error(
                                            `Error while forgetting "${network.wifi.ssid}": ${err}`,
                                          ),
                                        );
                                      });
                                    },
                                    child: Widget.Label("󰆴"),
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ];
                    }
                    return [];
                  };

                  return (self.children = [
                    ...localIfConnected(),
                    ...wifiIfConnected(),
                  ]);
                });
              });
            },
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            children: [
              Widget.Box({
                hpack: "start",
                class_name: "menu-label-container network",
                child: Widget.Label({
                  class_name: "menu-label network",
                  hpack: "start",
                  label: "Available Networks",
                }),
              }),
              Widget.Box({
                hexpand: true,
                hpack: "end",
                child: Widget.Button({
                  class_name: "menu-icon-button refresh network",
                  on_primary_click: () => {
                    network.wifi.scan();
                  },
                  child: Widget.Icon("view-refresh-symbolic"),
                }),
              }),
            ],
          }),
          Widget.Box({
            class_name: "menu-item-box network",
            vertical: true,
            children: [
              Widget.Box({
                vertical: true,
                setup: (self) => {
                  self.hook(pendingAuth, () => {
                    const accPoint = network.wifi.access_points.find(
                      (ap) => ap.bssid === pendingAuth.value,
                    );
                    if (
                      pendingAuth.value !== "" &&
                      accPoint !== undefined &&
                      network.wifi.ssid !== pendingAuth.value
                    ) {
                      return (self.child = Widget.Box({
                        vertical: true,
                        children: [
                          Widget.Button({
                            class_name: "network-element-item",
                            child: Widget.Box({
                              children: [
                                Widget.Box({
                                  hpack: "start",
                                  vertical: true,
                                  children: [
                                    Widget.Box({
                                      class_name:
                                        "network-element-items-container",
                                      children: [
                                        Widget.Button({
                                          class_name:
                                            "menu-button-icon network",
                                          child: Widget.Icon({
                                            tooltip_text:
                                              accPoint.ssid ===
                                              network.wifi.ssid
                                                ? network.wifi.state
                                                : null,
                                            icon: `${accPoint["iconName"]}`,
                                          }),
                                        }),
                                        Widget.Label({
                                          class_name:
                                            "menu-button-name network",
                                          truncate: "end",
                                          wrap: true,
                                          label: accPoint.ssid,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),

                          Widget.Revealer({
                            transition: "slide_down",
                            reveal_child: pendingAuth
                              .bind("value")
                              .as((v) => (v === accPoint.bssid ? true : false)),
                            class_name: "network-password-input-container",
                            child: Widget.Box({
                              hexpand: true,
                              children: [
                                Widget.Box({
                                  child: Widget.Entry({
                                    hpack: "start",
                                    class_name: "network-password-input",
                                    placeholder_text: "enter password",
                                    visibility: false,
                                    onAccept: (selfInp) => {
                                      Utils.execAsync(
                                        `nmcli dev wifi connect ${accPoint.bssid} password ${selfInp.text}`,
                                      )
                                        .catch((err) => {
                                          pendingAuth.value = "";
                                          console.error(
                                            `Failed to connect to wifi: ${accPoint.ssid}... ${err}`,
                                          );
                                        })
                                        .then(() => (pendingAuth.value = ""));
                                      selfInp.text = "";
                                    },
                                  }),
                                }),
                                Widget.Box({
                                  class_name:
                                    "network-password-input-close-container",
                                  hexpand: true,
                                  child: Widget.Button({
                                    class_name: "network-password-input-close",
                                    on_primary_click: () =>
                                      (pendingAuth.value = ""),
                                    child: Widget.Label("󰅜 "),
                                  }),
                                }),
                              ],
                            }),
                          }),
                        ],
                      }));
                    } else {
                      self.children = [];
                    }
                  });
                },
              }),
              Widget.Box({
                vertical: true,
                setup: (self) => {
                  self.hook(network, () => {
                    let sortedNetworks = [];

                    self.hook(pendingAuth, () => {
                      if (network.wifi.access_points.length > 0) {
                        sortedNetworks = network.wifi.access_points
                          .filter((ap) => {
                            return (
                              ap.ssid !== "Unknown" &&
                              ap.bssid !== pendingAuth.value &&
                              !ap.active &&
                              network.wifi.ssid !== ap.ssid
                            );
                          })
                          .sort((a, b) => {
                            return b.strength - a.strength;
                          });
                      }

                      if (sortedNetworks.length <= 0) {
                        return self.children = [
                          Widget.Label({
                            class_name: "not-found-label dim",
                            expand: true,
                            hpack: "center",
                            vpack: "center",
                            label: "No Wifi Networks Found"
                          })
                        ]
                      }

                      return (self.children = sortedNetworks.map((accPoint) => {
                        return Widget.Box({
                          vertical: true,
                          children: [
                            Widget.Button({
                              on_primary_click: () => {
                                Utils.execAsync(
                                  `nmcli device wifi connect ${accPoint.bssid}`,
                                ).catch((err) => {
                                  if (
                                    err
                                      .toLowerCase()
                                      .includes(
                                        "secrets were required, but not provided",
                                      )
                                  ) {
                                    pendingAuth.value = accPoint.bssid;
                                  }
                                });
                              },
                              class_name: "network-element-item",
                              child: Widget.Box({
                                children: [
                                  Widget.Box({
                                    hpack: "start",
                                    vertical: true,
                                    children: [
                                      Widget.Box({
                                        class_name:
                                          "network-element-items-container",
                                        children: [
                                          Widget.Button({
                                            class_name:
                                              "menu-button-icon network",
                                            child: Widget.Icon({
                                              tooltip_text:
                                                accPoint.ssid ===
                                                network.wifi.ssid
                                                  ? network.wifi.state
                                                  : null,
                                              icon: `${accPoint["iconName"]}`,
                                            }),
                                          }),
                                          Widget.Label({
                                            class_name:
                                              "menu-button-name network",
                                            truncate: "end",
                                            wrap: true,
                                            label: accPoint.ssid,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            Widget.Revealer({
                              transition: "slide_down",
                              reveal_child: pendingAuth
                                .bind("value")
                                .as((v) =>
                                  v === accPoint.bssid ? true : false,
                                ),
                              class_name: "network-password-input-container",
                              child: Widget.Box({
                                hexpand: true,
                                children: [
                                  Widget.Entry({
                                    hexpand: true,
                                    class_name: "network-password-input",
                                    placeholder_text: "enter password",
                                    visibility: false,
                                    onAccept: (selfInp) => {
                                      selfInp.text = "";
                                    },
                                  }),
                                ],
                              }),
                            }),
                          ],
                        });
                      }));
                    });
                  });
                },
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
