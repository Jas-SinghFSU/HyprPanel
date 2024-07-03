const time = Variable("", {
  poll: [1000, 'date "+%I:%M:%S"'],
});

const period = Variable("", {
  poll: [1000, 'date "+%p"'],
});

const TimeWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container clock",
    hexpand: true,
    vpack: "center",
    hpack: "fill",
    child: Widget.Box({
      hexpand: true,
      vpack: "center",
      hpack: "center",
      class_name: "clock-content-items",
      children: [
        Widget.Box({
          hpack: "center",
          children: [
            Widget.Label({
              class_name: "clock-content-time",
              label: time.bind(),
            }),
          ],
        }),
        Widget.Box({
          hpack: "center",
          children: [
            Widget.Label({
              vpack: "end",
              class_name: "clock-content-period",
              label: period.bind(),
            }),
          ],
        }),
      ],
    }),
  });
};

export { TimeWidget };
