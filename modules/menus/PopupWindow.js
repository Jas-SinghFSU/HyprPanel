export const Padding = (name, opts = {}) =>
  Widget.EventBox({
    class_name: opts?.className || "",
    hexpand: true,
    vexpand: typeof opts?.vexpand === "boolean" ? opts.vexpand : true,
    can_focus: false,
    child: Widget.Box(),
    setup: (w) => w.on("button-press-event", () => App.toggleWindow(name)),
  });

const PopupRevealer = (name, child, transition = "slide_down") =>
  Widget.Box(
    { css: "padding: 1px;" },
    Widget.Revealer({
      transition,
      child: Widget.Box({
        class_name: `window-content ${name}-window`,
        child,
      }),
      transitionDuration: 200,
      setup: (self) =>
        self.hook(App, (_, wname, visible) => {
          if (wname === name) self.reveal_child = visible;
        }),
    }),
  );

const Layout = (name, child, transition) => ({
  center: () =>
    Widget.CenterBox(
      {},
      Padding(name),
      Widget.CenterBox(
        { vertical: true },
        Padding(name),
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  top: () =>
    Widget.CenterBox(
      {},
      Padding(name),
      Widget.Box(
        { vertical: true },
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  "top-right": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name, {
          vexpand: false,
          className: "event-top-padding",
        }),
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
    ),
  "top-center": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name, {
          vexpand: false,
          className: "event-top-padding",
        }),
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  "top-left": () =>
    Widget.Box(
      {},
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name, {
          vexpand: false,
          className: "event-top-padding",
        }),
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  "bottom-left": () =>
    Widget.Box(
      {},
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
      Padding(name),
    ),
  "bottom-center": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
      Padding(name),
    ),
  "bottom-right": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
    ),
});

export default ({
  name,
  child,
  layout = "center",
  transition,
  exclusivity = "ignore",
  ...props
}) =>
  Widget.Window({
    name,
    class_names: [name, "popup-window"],
    setup: (w) => w.keybind("Escape", () => App.closeWindow(name)),
    visible: false,
    keymode: "on-demand",
    exclusivity,
    layer: "top",
    anchor: ["top", "bottom", "right", "left"],
    child: Layout(name, child, transition)[layout](),
    ...props,
  });
