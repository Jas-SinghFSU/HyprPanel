const hyprland = await Service.import("hyprland");

function range(length, start = 1) {
  return Array.from({ length }, (_, i) => i + start);
}

const Workspaces = (monitor = -1, wsMap = {}, ws = 8) => {
  const getWorkspacesForMonitor = (curWs) => {
    if (
      Object.keys(wsMap)
        .map((mn) => Number(mn))
        .includes(monitor)
    ) {
      return wsMap[monitor].includes(curWs);
    }
    return true;
  };
  return {
    component: Widget.Box({
      class_name: "workspaces",
      children: range(ws || 8)
        .filter((i) => getWorkspacesForMonitor(i))
        .map((i) => {
          return Widget.Label({
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

                const isCurrentMonitor =
                  monitor !== -1 &&
                  hyprland.getWorkspace(i)?.monitorID !== monitor;

                self.toggleClassName("hidden", isCurrentMonitor);
              }),
          });
        }),
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
