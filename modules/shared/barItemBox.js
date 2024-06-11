const hyprland = await Service.import("hyprland");
import { globalMousePos } from "../../globals.js";

export const BarItemBox = (child) => {
  const computeVisible = () => {
    if (Object.hasOwnProperty.call(child, "isVis")) {
      return child.isVis.bind("value");
    }

    return child.isVisible;
  };

  return Widget.Button({
    on_primary_click: (a, b, c, d) => {
      const monX = hyprland.monitors[hyprland.active.monitor.id].x;
      const monY = hyprland.monitors[hyprland.active.monitor.id].y;

      const cursorPos = Utils.exec("hyprctl cursorpos").split(", ").map(Number);
      cursorPos[0] = cursorPos[0] - monX;
      cursorPos[1] = cursorPos[1] - monY;
      globalMousePos.value = cursorPos;
      App.toggleWindow("audiomenu");
    },
    class_name: "bar_item_box_visible",
    child: child.component,
    visible: computeVisible(),
    ...child.props,
  });
};
