const Controls = () => {
  return Widget.Box({
    class_name: "dashboard-card controls-container",
    hpack: "fill",
    vpack: "fill",
    expand: true,
    children: [
      Widget.Button({
        expand: true,
        class_name: "dashboard-button wifi",
        child: Widget.Label({
          label: "󰤨",
        }),
      }),
      Widget.Button({
        expand: true,
        class_name: "dashboard-button bluetooth",
        child: Widget.Label({
          label: "󰂯",
        }),
      }),
      Widget.Button({
        expand: true,
        class_name: "dashboard-button notifications",
        child: Widget.Label({
          label: "󰂚",
        }),
      }),
      Widget.Button({
        expand: true,
        class_name: "dashboard-button playback",
        child: Widget.Label({
          label: "󰕾",
        }),
      }),
      Widget.Button({
        expand: true,
        class_name: "dashboard-button input",
        child: Widget.Label({
          label: "󰍬",
        }),
      }),
    ],
  });
};

export { Controls };
