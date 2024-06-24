const bluetooth = await Service.import("bluetooth");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  const connectedDevices = (btDevices) => {
    const noDevices = () => {
      return Widget.Box({
        hpack: "start",
        hexpand: true,
        child: Widget.Label({
          class_name: "dim",
          label: "No devices connected",
        }),
      });
    };

    const deviceList = () => {
      return Widget.Box({
        vertical: true,
        children: btDevices.map((dev) =>
          Widget.Box({
            child: Widget.Box({
              children: [
                Widget.Box({
                  hpack: "start",
                  vertical: true,
                  children: [
                    Widget.Box({
                      children: [
                        Widget.Button({
                          child: Widget.Icon(`${dev["icon-name"]}-symbolic`),
                        }),
                        Widget.Label({
                          class_name: "menu-button-name bluetooth",
                          truncate: "end",
                          wrap: true,
                          label: dev.alias,
                        }),
                      ],
                    }),
                    Widget.Box({
                      class_name: "menu-button-name-container status dim",
                      children: [
                        Widget.Label({
                          class_name: "menu-button-name status dim",
                          label: dev.connected
                            ? "Connected"
                            : dev.paired
                              ? "Paired"
                              : "",
                        }),
                      ],
                    }),
                  ],
                }),
                Widget.Box({
                  hpack: "end",
                  expand: true,
                  children: [
                    Widget.Button({
                      class_name: "menu-icon-button unpair bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.paired ? "unpair" : "pair",
                        class_name: "menu-icon-button-label unpair bluetooth",
                        label: dev.paired ? "" : "",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync([
                          "bash",
                          "-c",
                          `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                        ]).catch((err) =>
                          console.error(
                            `bluetoothctl ${dev.paired ? "unpair" : "pair"} ${dev.address}`,
                            err,
                          ),
                        ),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button disconnect bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.connected ? "disconnect" : "connect",
                        class_name:
                          "menu-icon-button-label disconnect bluetooth",
                        label: dev.connected ? "󱘖" : "",
                      }),
                      on_primary_click: () => dev.setConnection(false),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button untrust bluetooth",
                      child: Widget.Label({
                        tooltip_text: dev.trusted ? "untrust" : "trust",
                        class_name: "menu-icon-button-label untrust bluetooth",
                        label: dev.trusted ? "" : "󱖡",
                      }),
                      on_primary_click: () =>
                        Utils.execAsync([
                          "bash",
                          "-c",
                          `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                        ]).catch((err) =>
                          console.error(
                            `bluetoothctl ${dev.trusted ? "untrust" : "trust"} ${dev.address}`,
                            err,
                          ),
                        ),
                    }),
                    Widget.Button({
                      class_name: "menu-icon-button delete bluetooth",
                      child: Widget.Label({
                        tooltip_text: "delete",
                        class_name: "menu-icon-button-label delete bluetooth",
                        label: "󰆴",
                      }),
                      on_primary_click: () => {
                        Utils.execAsync([
                          "bash",
                          "-c",
                          `bluetoothctl remove ${dev.address}`,
                        ]).catch((err) =>
                          console.error("Bluetooth Remove", err),
                        );
                      },
                    }),
                  ],
                }),
              ],
            }),
          }),
        ),
      });
    };

    console.log(JSON.stringify(btDevices, null, 2));

    return btDevices.length === 0 ? noDevices() : deviceList();
  };

  const renderDevices = () => {
    return Widget.Box({
      class_name: "search-devices-container",
      vertical: true,
      setup: (self) =>
        self.hook(bluetooth, () => {
          const availableDevices = bluetooth.devices.filter(
            (device) =>
              device.name !== null &&
              !bluetooth.connected_devices.find(
                (dev) => dev.address === device.address,
              ),
          );

          if (availableDevices.length === 0) {
            return (self.children = [
              Widget.Box({
                class_name: "empty-bt-devices-container dim",
                vertical: true,
                children: [
                  Widget.Label({
                    hexpand: true,
                    label: "No devices currently found",
                  }),
                  Widget.Label({
                    hexpand: true,
                    label: "Press '󰑐' to search",
                  }),
                ],
              }),
            ]);
          }
          return (self.children = bluetooth.devices
            .filter(
              (device) =>
                device.name !== null &&
                !bluetooth.connected_devices.find(
                  (dev) => dev.address === device.address,
                ),
            )
            .map((device) => {
              return Widget.Button({
                hexpand: true,
                class_name: `menu-button bluetooth ${device}`,
                on_primary_click: () => {
                  device.setConnection(true);
                },
                child: Widget.Box({
                  children: [
                    Widget.Box({
                      hpack: "start",
                      children: [
                        Widget.Icon({
                          class_name: "menu-button-icon bluetooth",
                          icon: `${device["icon-name"]}-symbolic`,
                        }),
                        Widget.Label({
                          hexpand: true,
                          class_name: "menu-button-name bluetooth",
                          truncate: "end",
                          wrap: true,
                          label: device.alias,
                        }),
                      ],
                    }),
                    Widget.Box({
                      hpack: "end",
                      children: device.connecting
                        ? [
                            Widget.Label({
                              class_name: "bluetooth-isconnecting",
                              label: "󰲼",
                            }),
                          ]
                        : [],
                    }),
                  ],
                }),
              });
            }));
        }),
    });
  };

  const bluetoothOnModule = () => {
    return Widget.Box({
      vertical: true,
      children: [
        Widget.Separator({
          class_name: "menu-separator",
        }),
        Widget.Box({
          class_name: "menu-container bluetooth",
          children: [
            Widget.Box({
              vertical: true,
              children: [
                Widget.Box({
                  class_name: "menu-label-container bluetooth",
                  children: [
                    Widget.Box({
                      hpack: "start",
                      child: Widget.Label({
                        class_name: "menu-label bluetooth",
                        label: "Devices",
                      }),
                    }),
                    Widget.Box({
                      hexpand: true,
                      hpack: "end",
                      child: Widget.Button({
                        class_name: "menu-icon-button",
                        on_primary_click: () => {
                          Utils.execAsync([
                            "bash",
                            "-c",
                            "bluetoothctl --timeout 120 scan on",
                          ]).catch((err) =>
                            console.error(
                              "bluetoothctl --timeout 120 scan on",
                              err,
                            ),
                          );
                        },
                        child: Widget.Icon("view-refresh-symbolic"),
                      }),
                    }),
                  ],
                }),
                Widget.Box({
                  child: renderDevices(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const bluetoothOffModule = () => {
    return Widget.Box({
      class_name: "bluetooth-disabled-menu",
      vertical: true,
      children: [
        Widget.Label({
          hexpand: true,
          vexpand: true,
          label: bluetooth
            .bind("state")
            .as((state) =>
              state === "turning-off"
                ? "Bluetooth is turning off..."
                : "Bluetooth is disabled",
            ),
        }),
      ],
    });
  };
  return DropdownMenu({
    name: "bluetoothmenu",
    transition: "crossfade",
    minWidth: 350,
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-dropdown-label-container",
            children: [
              Widget.Box({
                hexpand: true,
                hpack: "start",
                child: Widget.Label({
                  class_name: "menu-dropdown-label bluetooth",
                  label: "Bluetooth",
                }),
              }),
              Widget.Box({
                hexpand: true,
                hpack: "end",
                children: [
                  // NOTE: Do we want to add this back to restart bluetooth service if it every hangs?
                  // Widget.Button({
                  //   class_name: "menu-icon-button restart-bluetooth-service",
                  //   tooltip_text: "Restart Bluetooth Service",
                  //   on_primary_click: () => Utils.execAsync('systemctl restart bluetooth'),
                  //   child: Widget.Label({
                  //     class_name: "menu-icon-button-label",
                  //     label: "󱄌"
                  //   })
                  // }),
                  Widget.Switch({
                    class_name: "menu-switch bluetooth",
                    active: bluetooth.bind("enabled"),
                    on_activate: ({ active }) =>
                      Utils.execAsync([
                        "bash",
                        "-c",
                        `bluetoothctl power ${active ? "on" : "off"}`,
                      ]).catch((err) =>
                        console.error(
                          `bluetoothctl power ${active ? "on" : "off"}`,
                          err,
                        ),
                      ),
                  }),
                ],
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            vertical: true,
            children: bluetooth.bind("enabled").as((isOn) =>
              isOn
                ? [
                    Widget.Box({
                      class_name: "menu-label-container",
                      child: Widget.Label({
                        class_name: "menu-label bluetooth",
                        hpack: "start",
                        label: "My Devices",
                      }),
                    }),
                    Widget.Box({
                      vertical: true,
                      class_name: "menu-item-box",
                      child: bluetooth
                        .bind("connected_devices")
                        .as((btConDevs) => connectedDevices(btConDevs)),
                    }),
                  ]
                : [],
            ),
          }),
          Widget.Box({
            vertical: true,
            child: bluetooth
              .bind("enabled")
              .as((btEnabled) =>
                btEnabled ? bluetoothOnModule() : bluetoothOffModule(),
              ),
          }),
        ],
      }),
    }),
  });
};
