const Controls = () => {
  return Widget.Box({
    class_name: "controls-container",
    children: [
      Widget.Button({
        class_name: "dashboard-button airplane-mode",
      }),
      Widget.Separator({
        hpack: "center",
        vexpand: true,
        vertical: true,
        class_name: "menu-separator dashboard-controls",
      }),
      Widget.Button({
        class_name: "dashboard-button wifi",
      }),
      Widget.Button({
        class_name: "dashboard-button bluetooth",
      }),
      Widget.Button({
        class_name: "dashboard-button notifications",
      }),
      Widget.Button({
        class_name: "dashboard-button playback",
      }),
      Widget.Button({
        class_name: "dashboard-button input",
      }),
    ],
  });
};

export { Controls };
