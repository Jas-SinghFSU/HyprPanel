const network = await Service.import("network");

const Network = () => {
  const wifiIndicator = [
    Widget.Icon({
      icon: network.wifi.bind("icon_name"),
    }),
    Widget.Label({
      label: network.wifi
        .bind("ssid")
        .as((ssid) => (ssid ? ` ${ssid}` : " Unknown")),
    }),
  ];

  const wiredIndicator = [
    Widget.Label({
      label: network.bind("wired").as(() => "󰈀 Wired"),
    }),
  ];

  return {
    component: Widget.Box({
      class_name: "bar-network",
      children: network
        .bind("primary")
        .as((w) => (w === "wired" ? wiredIndicator : wifiIndicator)),
    }),
    isVisible: true,
  };
};

export { Network };
