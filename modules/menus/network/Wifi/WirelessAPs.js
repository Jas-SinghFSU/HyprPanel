const renderWAPs = (self, network) => {
  self.hook(network, () => {
    const WAPs = network.wifi.access_points;

    console.log("WAPs");
    console.log(JSON.stringify(WAPs, null, 2));

    const filteredWAPs = WAPs.filter((ap) => ap.ssid !== "Unknown").sort(
      (a, b) => {
        return b.strength - a.strength;
      },
    );

    if (filteredWAPs.length <= 0) {
      return (self.child = Widget.Label({
        class_name: "waps-not-found dim",
        expand: true,
        hpack: "center",
        vpack: "center",
        label: "No Wi-Fi Networks Found",
      }));
    }
    return (self.children = filteredWAPs.map((ap) => {
      return Widget.Button({
        class_name: "network-element-item",
        child: Widget.Box({
          hpack: "start",
          children: [
            Widget.Icon({
              class_name: "network-ethernet-icon",
              icon: `${ap["iconName"]}`,
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
                  label: ap.ssid,
                }),
                Widget.Revealer({
                  revealChild: ap.active,
                  child: Widget.Label({
                    hpack: "start",
                    class_name: "connection-status dim",
                    label: "Connected",
                  }),
                }),
              ],
            }),
          ],
        }),
      });
    }));
  });
};

export { renderWAPs };
