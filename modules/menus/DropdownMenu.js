const hyprland = await Service.import("hyprland");

export const Padding = (name) =>
  Widget.EventBox({
    hexpand: true,
    vexpand: true,
    can_focus: true,
    child: Widget.Box(),
    setup: (w) => w.on("button-press-event", () => App.toggleWindow(name)),
  });

const moveBoxToCursor = (self, fixed) => {
  if (fixed) {
    return;
  }

  globalMousePos.connect("changed", ({ value }) => {
    const currentWidth = self.child.get_allocation().width;

    let monWidth = hyprland.monitors[hyprland.active.monitor.id].width;
    let monHeight = hyprland.monitors[hyprland.active.monitor.id].height;

    // If GDK Scaling is applied, then get divide width by scaling
    // to get the proper coordinates.
    // Ex: On a 2860px wide monitor... if scaling is set to 2, then the right
    // end of the monitor is the 1430th pixel.
    const gdkScale = Utils.exec('bash -c "echo $GDK_SCALE"');

    if (/^\d+(.\d+)?$/.test(gdkScale)) {
      const scale = parseFloat(gdkScale);
      monWidth = monWidth / scale;
      monHeight = monHeight / scale;
    }

    // If monitor is vertical (transform = 1 || 3) swap height and width
    if (hyprland.monitors[hyprland.active.monitor.id].transform % 2 !== 0) {
      [monWidth, monHeight] = [monHeight, monWidth];
    }

    let marginRight = monWidth - currentWidth / 2;
    marginRight = fixed ? marginRight - monWidth / 2 : marginRight - value[0];
    let marginLeft = monWidth - currentWidth - marginRight;

    const minimumMargin = 0;

    if (marginRight < minimumMargin) {
      marginRight = minimumMargin;
      marginLeft = monWidth - currentWidth - minimumMargin;
    }

    if (marginLeft < minimumMargin) {
      marginLeft = minimumMargin;
      marginRight = monWidth - currentWidth - minimumMargin;
    }

    const marginTop = 45;
    const marginBottom = monHeight - marginTop;
    self.set_margin_left(marginLeft);
    self.set_margin_right(marginRight);
    self.set_margin_bottom(marginBottom);
  });
};

// NOTE: We make the window visible for 2 seconds (on startup) so the child
// elements can allocat their proper dimensions.
// Otherwise the width that we rely on for menu positioning is set improperly
// for the first time we open a menu of each type.
const initRender = Variable(true);

setTimeout(() => {
  initRender.value = false;
}, 2000);

export default ({
  name,
  child,
  layout = "center",
  transition,
  exclusivity = "ignore",
  fixed = false,
  ...props
}) =>
  Widget.Window({
    name,
    class_names: [name, "dropdown-menu"],
    setup: (w) => w.keybind("Escape", () => App.closeWindow(name)),
    visible: initRender.bind("value"),
    keymode: "on-demand",
    exclusivity,
    layer: "top",
    anchor: ["top", "left"],
    child: Widget.EventBox({
      class_name: "parent-event",
      on_primary_click: () => App.closeWindow(name),
      on_secondary_click: () => App.closeWindow(name),
      child: Widget.Box({
        class_name: "top-eb",
        vertical: true,
        children: [
          Widget.EventBox({
            class_name: "mid-eb event-top-padding",
            hexpand: true,
            vexpand: false,
            can_focus: false,
            child: Widget.Box(),
            setup: (w) => {
              w.on("button-press-event", () => App.toggleWindow(name));
              w.set_margin_top(1);
            },
          }),
          Widget.EventBox({
            class_name: "in-eb menu-event-box",
            on_primary_click: () => {
              return true;
            },
            on_secondary_click: () => {
              return true;
            },
            setup: (self) => {
              moveBoxToCursor(self, fixed);
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
                  children: [child],
                }),
              }),
            }),
          }),
        ],
      }),
    }),
    ...props,
  });
