const renderWapStaging = (self, network, staging, connecting) => {
  Utils.merge([network.bind("wifi"), staging.bind("value")], () => {
    if (!Object.keys(staging.value).length) {
      return (self.child = Widget.Box());
    }

    return (self.child = Widget.Box({
      class_name: "network-element-item staging",
      vertical: true,
      children: [
        Widget.Box({
          hpack: "fill",
          hexpand: true,
          children: [
            Widget.Icon({
              class_name: `network-icon wifi`,
              icon: `${staging.value.iconName}`,
            }),
            Widget.Box({
              class_name: "connection-container",
              hexpand: true,
              vertical: true,
              children: [
                Widget.Label({
                  class_name: "active-connection",
                  hpack: "start",
                  truncate: "end",
                  wrap: true,
                  label: staging.value.ssid,
                }),
              ],
            }),
            Widget.Revealer({
              hpack: "end",
              reveal_child: connecting
                .bind("value")
                .as((c) => staging.value.bssid === c),
              child: Widget.Spinner({
                class_name: "spinner wap",
              }),
            }),
          ],
        }),
        Widget.Box({
          class_name: "network-password-input-container",
          hpack: "fill",
          hexpand: true,
          children: [
            Widget.Entry({
              hpack: "start",
              hexpand: true,
              visibility: false,
              class_name: "network-password-input",
              placeholder_text: "enter password",
              onAccept: (selfInp) => {
                connecting.value = staging.value.bssid;
                Utils.execAsync(
                  `nmcli dev wifi connect ${staging.value.bssid} password ${selfInp.text}`,
                )
                  .catch((err) => {
                    connecting.value = "";
                    console.error(
                      `Failed to connect to wifi: ${staging.value.ssid}... ${err}`,
                    );
                    Utils.notify({
                      summary: "Network",
                      body: err,
                      timeout: 5000,
                    });
                  })
                  .then(() => {
                    connecting.value = "";
                    staging.value = {};
                  });
                selfInp.text = "";
              },
            }),
            Widget.Button({
              hpack: "end",
              class_name: "close-network-password-input-button",
              on_primary_click: () => {
                connecting.value = "";
                staging.value = {};
              },
              child: Widget.Icon({
                class_name: "close-network-password-input-icon",
                icon: "window-close-symbolic",
              }),
            }),
          ],
        }),
      ],
    }));
  });
};

export { renderWapStaging };
