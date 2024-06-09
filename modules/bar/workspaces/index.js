const hyprland = await Service.import("hyprland");

function range(length, start = 1) {
  return Array.from({ length }, (_, i) => i + start);
}

const Workspaces = (ws) => {
  return {
    component: Widget.Box({
      class_name: "workspaces",
      children: range(ws || 8).map((i) =>
        Widget.Label({
          attribute: i,
          vpack: "center",
          label: `${i}`,
          setup: (self) =>
            self.hook(hyprland, () => {
              self.toggleClassName(
                "active",
                hyprland.active.workspace.id === i,
              );
              self.toggleClassName(
                "occupied",
                (hyprland.getWorkspace(i)?.windows || 0) > 0,
              );
            }),
        }),
      ),
      setup: (box) => {
        if (ws === 0) {
          box.hook(hyprland.active.workspace, () =>
            box.children.map((btn) => {
              btn.visible = hyprland.workspaces.some(
                (ws) => ws.id === btn.attribute,
              );
            }),
          );
        }
      },
    }),
    isVisible: true,
  };
};
export { Workspaces };
