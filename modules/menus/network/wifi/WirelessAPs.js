import { getWifiIcon } from "../utils.js";
const renderWAPs = (self, network, staging, connecting) => {
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

  const WifiStatusMap = {
    unknown: "Status Unknown",
    unmanaged: "Unmanaged",
    unavailable: "Unavailable",
    disconnected: "Disconnected",
    prepare: "Preparing Connecting",
    config: "Connecting",
    need_auth: "Needs Authentication",
    ip_config: "Requesting IP",
    ip_check: "Checking Access",
    secondaries: "Waiting on Secondaries",
    activated: "Connected",
    deactivating: "Disconnecting",
    failed: "Connection Failed",
  };
  self.hook(network, () => {
    Utils.merge([staging.bind("value"), connecting.bind("value")], () => {
      // Sometimes the network service will yield a "this._device is undefined" when
      // trying to access the "access_points" property. So we must validate that
      // it's not 'undefined'
      let WAPs =
        network.wifi._device !== undefined ? network.wifi["access-points"] : [];

      const dedupeWAPs = () => {
        const dedupMap = {};
        WAPs.forEach((item) => {
          if (!Object.hasOwnProperty.call(dedupMap, item.ssid)) {
            dedupMap[item.ssid] = item;
          }
        });

        return Object.keys(dedupMap).map((itm) => dedupMap[itm]);
      };

      WAPs = dedupeWAPs();

      const isInStaging = (wap) => {
        if (Object.keys(staging.value).length === 0) {
          return false;
        }

        return wap.bssid === staging.value.bssid;
      };

      const isDisconnecting = (wap) => {
        if (wap.ssid === network.wifi.ssid) {
          return network.wifi.state.toLowerCase() === "deactivating";
        }
        return false;
      };

      const filteredWAPs = WAPs.filter((ap) => {
        return ap.ssid !== "Unknown" && !isInStaging(ap);
      }).sort((a, b) => {
        if (network.wifi.ssid === a.ssid) {
          return -1;
        }

        if (network.wifi.ssid === b.ssid) {
          return 1;
        }

        return b.strength - a.strength;
      });

      if (filteredWAPs.length <= 0 && Object.keys(staging.value).length === 0) {
        return (self.child = Widget.Label({
          class_name: "waps-not-found dim",
          expand: true,
          hpack: "center",
          vpack: "center",
          label: "No Wi-Fi Networks Found",
        }));
      }
      return (self.children = filteredWAPs.map((ap) => {
        return Widget.Box({
          children: [
            Widget.Button({
              on_primary_click: () => {
                if (ap.bssid === connecting.value || ap.active) {
                  return;
                }

                connecting.value = ap.bssid;
                Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`)
                  .then(() => {
                    connecting.value = "";
                    staging.value = {};
                  })
                  .catch((err) => {
                    if (
                      err
                        .toLowerCase()
                        .includes("secrets were required, but not provided")
                    ) {
                      staging.value = ap;
                    } else {
                      Utils.notify({
                        summary: "Network",
                        body: err,
                        timeout: 5000,
                      });
                    }
                    connecting.value = "";
                  });
              },
              class_name: "network-element-item",
              child: Widget.Box({
                hexpand: true,
                children: [
                  Widget.Box({
                    hpack: "start",
                    hexpand: true,
                    children: [
                      Widget.Label({
                        vpack: "start",
                        class_name: `network-icon wifi ${ap.ssid === network.wifi.ssid ? "active" : ""}`,
                        label: getWifiIcon(`${ap["iconName"]}`),
                      }),
                      Widget.Box({
                        class_name: "connection-container",
                        vpack: "center",
                        vertical: true,
                        children: [
                          Widget.Label({
                            vpack: "center",
                            class_name: "active-connection",
                            hpack: "start",
                            truncate: "end",
                            wrap: true,
                            label: ap.ssid,
                          }),
                          Widget.Revealer({
                            revealChild: ap.ssid === network.wifi.ssid,
                            child: Widget.Label({
                              hpack: "start",
                              class_name: "connection-status dim",
                              label:
                                WifiStatusMap[network.wifi.state.toLowerCase()],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  Widget.Revealer({
                    hpack: "end",
                    vpack: "start",
                    reveal_child:
                      ap.bssid === connecting.value || isDisconnecting(ap),
                    child: Widget.Spinner({
                      vpack: "start",
                      class_name: "spinner wap",
                    }),
                  }),
                ],
              }),
            }),
            Widget.Revealer({
              vpack: "start",
              reveal_child: ap.bssid !== connecting.value && ap.active,
              child: Widget.Button({
                tooltip_text: "Delete/Forget Network",
                class_name: "menu-icon-button network disconnect",
                on_primary_click: () => {
                  connecting.value = ap.bssid;
                  Utils.execAsync("nmcli connection show --active").then(() => {
                    Utils.execAsync("nmcli connection show --active").then(
                      (res) => {
                        const connectionId = getIdBySsid(ap.ssid, res);

                        Utils.execAsync(
                          `nmcli connection delete ${connectionId} "${ap.ssid}"`,
                        )
                          .then(() => (connecting.value = ""))
                          .catch((err) => {
                            connecting.value = "";
                            console.error(
                              `Error while forgetting "${ap.ssid}": ${err}`,
                            );
                          });
                      },
                    );
                  });
                },
                child: Widget.Label({
                  label: "󰚃",
                }),
              }),
            }),
          ],
        });
      }));
    });
  });
};

export { renderWAPs };
