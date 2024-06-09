const systemtray = await Service.import("systemtray");

const SysTray = () => {
  const isVis = Variable(false);

  const items = systemtray.bind("items").as((items) => {
    isVis.value = items.length > 0;
    return items.map((item) => {
      if (item.menu !== undefined) {
        item.menu["class_name"] = "systray-menu";
      }

      return Widget.Button({
        cursor: "pointer",
        child: Widget.Icon({
          icon: item.bind("icon"),
          size: 18,
        }),
        on_primary_click: (_, event) => item.activate(event),
        on_secondary_click: (_, event) => item.openMenu(event),
        tooltip_markup: item.bind("tooltip_markup"),
      });
    });
  });

  return {
    component: Widget.Box({
      class_name: "systray",
      children: items,
    }),
    isVisible: true,
    isVis,
  };
};

export { SysTray };
