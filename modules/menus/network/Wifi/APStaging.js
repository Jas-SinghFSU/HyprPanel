const renderWapStaging = (self, stagedDevice) => {
  self.hook(stagedDevice, ({ value }) => {
    return (self.child = Widget.Button({
      class_name: "network-element-item",
      child: Widget.Box({
        hpack: "start",
        children: [
          Widget.Icon({
            class_name: "network-ethernet-icon",
            icon: `${stagedDevice["iconName"]}`,
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
                label: stagedDevice.ssid,
              }),
              Widget.Revealer({
                revealChild: stagedDevice.active,
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
    }));
  });
};

export { renderWapStaging };
