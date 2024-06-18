const battery = await Service.import("battery");

const BatteryLabel = () => {
  const isVis = Variable(battery.available);

  const value = battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0));
  const icon = battery
    .bind("percent")
    .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

  battery.connect("changed", ({ available }) => {
    isVis.value = available;
  });

  return {
    component: Widget.Box({
      class_name: "battery",
      visible: battery.bind("available"),
      children: [
        // Widget.Icon({ icon }),
        Widget.LevelBar({
          widthRequest: 20,
          vpack: "center",
          value,
        }),
      ],
    }),
    isVis,
  };
};

export { BatteryLabel };
