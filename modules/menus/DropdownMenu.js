const hyprland = await Service.import("hyprland");

export const Padding = (name) =>
  Widget.EventBox({
    hexpand: true,
    vexpand: true,
    can_focus: true,
    child: Widget.Box(),
    setup: (w) => w.on("button-press-event", () => App.toggleWindow(name)),
  });
const moveBoxToCursor = (self, minWidth, minHeight, fixed) => {
  globalMousePos.connect("changed", ({ value }) => {
    let monWidth = hyprland.monitors[hyprland.active.monitor.id].width;
    let monHeight = hyprland.monitors[hyprland.active.monitor.id].height;

    // If monitor is vertical (transform = 1 || 3) swap height and width
    if (hyprland.monitors[hyprland.active.monitor.id].transform % 2 !== 0) {
      [monWidth, monHeight] = [monHeight, monWidth];
    }

    let marginRight = monWidth - minWidth / 2;
    marginRight = fixed ? marginRight - monWidth / 2 : marginRight - value[0];
    let marginLeft = monWidth - minWidth - marginRight;

    if (marginRight < 0) {
      marginRight = 13;
      marginLeft = monWidth - minWidth - 13;
    } else if (marginRight < 13) {
      marginRight = 13;
      marginLeft = monWidth - minWidth - 13;
    }
    const marginTop = 40;
    const marginBottom = monHeight + minHeight - marginTop;
    self.set_margin_left(marginLeft);
    self.set_margin_right(marginRight);
    self.set_margin_top(marginTop);
    self.set_margin_bottom(marginBottom);
  });
};

export default ({
  name,
  child,
  layout = "center",
  transition,
  minWidth = 375,
  minHeight = 200,
  exclusivity = "ignore",
  fixed = false,
  ...props
}) =>
  Widget.Window({
    name,
    class_names: [name, "dropdown-menu"],
    setup: (w) => w.keybind("Escape", () => App.closeWindow(name)),
    visible: false,
    keymode: "on-demand",
    exclusivity,
    layer: "top",
    anchor: ["top", "left"],
    child: Widget.EventBox({
      on_primary_click: () => App.closeWindow(name),
      on_secondary_click: () => App.closeWindow(name),
      child: Widget.EventBox({
        on_primary_click: () => {
          return true;
        },
        on_secondary_click: () => {
          return true;
        },
        setup: (self) => {
          moveBoxToCursor(self, minWidth, minHeight, fixed);
        },
        child: Widget.Box({
          class_name: "dropdown-menu-container",
          css: "padding: 1px; margin: -1px;",
          child: Widget.Revealer({
            revealChild: false,
            setup: (self) =>
              self.hook(App, (_, wname, visible) => {
                if (wname === name) self.reveal_child = visible;
              }),
            transition: "crossfade",
            transitionDuration: 350,
            child: Widget.Box({
              class_name: "dropdown-menu-container",
              can_focus: true,
              children: [Padding(name), child],
            }),
          }),
        }),
      }),
    }),
    ...props,
  });
