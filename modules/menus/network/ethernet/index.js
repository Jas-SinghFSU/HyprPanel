const network = await Service.import("network");

const Ethernet = () => {
  return Widget.Box({
    class_name: "menu-section-container ethernet",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "menu-label",
          hexpand: true,
          hpack: "start",
          label: "Ethernet",
        }),
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vertical: true,
        child: Widget.Box({
          class_name: "menu-content",
          vertical: true,
          child: network.bind("wired").as((wired) => {
            return Widget.Box({
              class_name: "network-element-item",
              child: Widget.Box({
                hpack: "start",
                children: [
                  Widget.Icon({
                    class_name: `network-icon ethernet ${network.wired.state === "activated" ? "active" : ""}`,
                    tooltip_text: wired.internet,
                    icon: `${wired["icon_name"]}`,
                  }),
                  Widget.Box({
                    class_name: "connection-container",
                    vertical: true,
                    children: [
                      Widget.Label({
                        class_name: "active-connection",
                        hpack: "start",
                        truncate: "end",
                        wrap: true,
                        label: `Ethernet Connection ${wired.state !== "unknown" && typeof wired?.speed === "number" ? `(${wired?.speed / 1000} Gbps)` : ""}`,
                      }),
                      Widget.Label({
                        hpack: "start",
                        class_name: "connection-status dim",
                        label:
                          wired.internet.charAt(0).toUpperCase() +
                          wired.internet.slice(1),
                      }),
                    ],
                  }),
                ],
              }),
            });
          }),
        }),
      }),
    ],
  });
};

export { Ethernet };
