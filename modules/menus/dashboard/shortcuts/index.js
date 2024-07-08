const Shortcuts = () => {
  const handleClick = (action) => {
    App.closeWindow("dashboardmenu");
    Utils.execAsync(action)
    .then(res => res)
    .catch(err => err);
  }
  return Widget.Box({
    class_name: "shortcuts-container",
    hpack: "fill",
    hexpand: true,
    children: [
      Widget.Box({
        class_name: "container most-used dashboard-card",
        hexpand: true,
        children: [
          Widget.Box({
            class_name: "card-button-left-section",
            vertical: true,
            hexpand: true,
            children: [
              Widget.Button({
                class_name: "dashboard-button edge top-button",
                on_primary_click: () => handleClick("microsoft-edge-stable"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰇩",
                }),
              }),
              Widget.Button({
                class_name: "dashboard-button spotify",
                on_primary_click: () => handleClick("spotify-launcher"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
            ],
          }),
          Widget.Box({
            vertical: true,
            hexpand: true,
            children: [
              Widget.Button({
                class_name: "dashboard-button discord top-button",
                on_primary_click: () => handleClick("discord"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
              Widget.Button({
                class_name: "dashboard-button search",
                on_primary_click: () => handleClick("rofi -show drun"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
            ],
          }),
        ],
      }),
      Widget.Box({
        class_name: "container utilities dashboard-card",
        hexpand: true,
        children: [
          Widget.Box({
            class_name: "card-button-left-section",
            vertical: true,
            hexpand: true,
            children: [
              Widget.Button({
                class_name: "dashboard-button colorpicker top-button",
                on_primary_click: () => handleClick("hyprpicker"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
              Widget.Button({
                class_name: "dashboard-button settings",
                on_primary_click: () => handleClick('bash -c "kitty -e nvim $HOME/.config/hypr/hyprland.conf"'),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰒓",
                }),
              }),
            ],
          }),
          Widget.Box({
            vertical: true,
            hexpand: true,
            children: [
              Widget.Button({
                class_name: "dashboard-button snapshot top-button",
                on_primary_click: () => handleClick("grimblast --notify copysave area"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰄀",
                }),
              }),
              Widget.Button({
                class_name: "dashboard-button record",
                on_primary_click: () => handleClick("rofi -show drun"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰑊",
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export { Shortcuts };
