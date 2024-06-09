const bluetooth = await Service.import('bluetooth')

const Bluetooth = () => {
  const btIcon = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "󰂯 " : "󰂲 "),
    class_name: "bar-bt_icon",
  });

  const btText = Widget.Label({
    label: bluetooth.bind("enabled").as((v) => v ? "On" : "Off"),
    class_name: "bar-bt_label",
  });

  return {
    component: Widget.Box({
      class_name: "volume",
      children: [btIcon, btText],
    }),
    isVisible: true,
  };

}

export { Bluetooth }
