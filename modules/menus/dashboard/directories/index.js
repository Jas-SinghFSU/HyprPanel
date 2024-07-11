const Directories = () => {
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
            class_name: "directory-link downloads",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin Downloads").catch(
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
            class_name: "directory-link videos",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin Videos").catch(
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
            class_name: "directory-link projects",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin Projects").catch(
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
            class_name: "directory-link documents",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin Documents").catch(
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
            class_name: "directory-link pictures",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin Pictures").catch(
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
            class_name: "directory-link home",
            on_primary_click: () => {
              App.closeWindow("dashboardmenu");
              Utils.execAsync("dolphin ").catch(
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
