const Shortcuts = () => {
  return Widget.Box({
    class_name: "shortcuts-container",
    children: [
      Widget.Box({
        class_name: "most-used-container",
        children: [
          Widget.Button({
            class_name: "dashboard-button edge",
          }),
          Widget.Button({
            class_name: "dashboard-button spotify",
          }),
          Widget.Button({
            class_name: "dashboard-button discord",
          }),
          Widget.Button({
            class_name: "dashboard-button search",
          }),
        ],
      }),
      Widget.Box({
        class_name: "utilities-container",
        children: [
          Widget.Button({
            class_name: "dashboard-button utility",
          }),
          Widget.Button({
            class_name: "dashboard-button utility",
          }),
          Widget.Button({
            class_name: "dashboard-button utility",
          }),
          Widget.Button({
            class_name: "dashboard-button utility",
          }),
        ],
      }),
    ],
  });
};

export { Shortcuts };
