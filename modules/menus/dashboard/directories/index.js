import GLib from "gi://GLib";

const Directories = () => {
  const homeDir = GLib.get_home_dir();

  return Widget.Box({
    class_name: "dashboard-card directories-container",
    vpack: "fill",
    hpack: "fill",
    expand: true,
    children: [
      Widget.Box({
        vertical: true,
        expand: true,
        class_name: "section right",
        children: [
          Widget.Button({
            hpack: "start",
            expand: true,
            class_name: "directory-link left top",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/Downloads`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󰉍 Downloads",
            }),
          }),
          Widget.Button({
            expand: true,
            hpack: "start",
            class_name: "directory-link left middle",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/Videos`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󰉏 Videos",
            }),
          }),
          Widget.Button({
            expand: true,
            hpack: "start",
            class_name: "directory-link left bottom",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/Projects`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󰚝 Projects",
            }),
          }),
        ],
      }),
      Widget.Box({
        vertical: true,
        expand: true,
        class_name: "section left",
        children: [
          Widget.Button({
            hpack: "start",
            expand: true,
            class_name: "directory-link right top",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/Documents`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󱧶 Documents",
            }),
          }),
          Widget.Button({
            expand: true,
            hpack: "start",
            class_name: "directory-link right middle",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/Pictures`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󰉏 Pictures",
            }),
          }),
          Widget.Button({
            expand: true,
            hpack: "start",
            class_name: "directory-link right bottom",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync(`dolphin ${homeDir}/`).catch(
                (err) => `Failed to open Dolphin: ${err}`,
              );
            },
            child: Widget.Label({
              hpack: "start",
              label: "󱂵 Home",
            }),
          }),
        ],
      }),
    ],
  });
};

export { Directories };
