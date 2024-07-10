const hyprland = await Service.import("hyprland");

const Shortcuts = () => {
  const isRecording = Variable(false, {
    poll: [
      1000,
      `${App.configDir}/services/screen_record.sh status`,
      (out) => {
        if (out === "recording") {
          return true;
        }
        return false;
      },
    ],
  });
  const handleClick = (action, resolver) => {
    App.closeWindow("dashboardmenu");
    Utils.execAsync(action)
      .then((res) => {
        if (typeof resolver === "function") {
          return resolver(res);
        }

        return res;
      })
      .catch((err) => err);
  };

  const recordingDropdown = Widget.Menu({
    class_name: "dropdown recording",
    hpack: "fill",
    hexpand: true,
    setup: (self) => {
      self.hook(hyprland, () => {
        const displays = hyprland.monitors.map((mon) => {
          return Widget.MenuItem({
            label: `Display ${mon.name}`,
            on_activate: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(
                `${App.configDir}/services/screen_record.sh start ${mon.name}`,
              ).catch((err) => console.error(err));
            },
          });
        });

        const apps = hyprland.clients.map((clt) => {
          return Widget.MenuItem({
            label: `${clt.class.charAt(0).toUpperCase() + clt.class.slice(1)} (Workspace ${clt.workspace.name})`,
            on_activate: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(
                `${App.configDir}/services/screen_record.sh start ${clt.focusHistoryID}`,
              ).catch((err) => console.error(err));
            },
          });
        });

        return (self.children = [
          ...displays,
          // Disabled since window recording isn't available on wayland
          // ...apps
        ]);
      });
    },
  });

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
                tooltip_text: "Microsoft Edge",
                class_name: "dashboard-button edge top-button",
                on_primary_click: () => handleClick("microsoft-edge-stable"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰇩",
                }),
              }),
              Widget.Button({
                tooltip_text: "Spotify",
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
                tooltip_text: "Discord",
                class_name: "dashboard-button discord top-button",
                on_primary_click: () => handleClick("discord"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
              Widget.Button({
                tooltip_text: "Search Apps",
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
                tooltip_text: "Color Picker",
                class_name: "dashboard-button colorpicker top-button",
                on_primary_click: () => handleClick("hyprpicker -a"),
                child: Widget.Label({
                  class_name: "button-label",
                  label: "",
                }),
              }),
              Widget.Button({
                tooltip_text: "Hyprland Settings",
                class_name: "dashboard-button settings",
                on_primary_click: () =>
                  handleClick(
                    'bash -c "kitty -e nvim $HOME/.config/hypr/hyprland.conf"',
                  ),
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
                tooltip_text: "Screenshot",
                class_name: "dashboard-button snapshot top-button",
                on_primary_click: () => {
                  App.closeWindow("dashboardmenu");
                  return Utils.execAsync(
                    `${App.configDir}/services/snapshot.sh`,
                  ).catch((err) => console.error(err));
                },
                child: Widget.Label({
                  class_name: "button-label",
                  label: "󰄀",
                }),
              }),
              Widget.Button({
                tooltip_text: "Record Screen",
                class_name: isRecording
                  .bind("value")
                  .as((v) => `dashboard-button record ${v ? "active" : ""}`),
                setup: (self) => {
                  self.hook(isRecording, () => {
                    self.toggleClassName("hover", true);
                    self.on_primary_click = (_, event) => {
                      if (isRecording.value === true) {
                        App.closeWindow("dashboardmenu");
                        return Utils.execAsync(
                          `${App.configDir}/services/screen_record.sh stop`,
                        ).catch((err) => console.error(err));
                      } else {
                        recordingDropdown.popup_at_pointer(event);
                      }
                    };
                  });
                },
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
