const audio = await Service.import("audio");
const hyprland = await Service.import("hyprland");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  return DropdownMenu({
    name: "audiomenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "audiomenu-items",
      setup: (self) =>
        globalMousePos.connect("changed", ({ value }) => {
          console.log("in hook");
          // console.log(value);
          console.log(globalMousePos.value);
          // TODO: Calculate these margins in the Dropmenu component
          // We should just pass width/height and the component will
          // calculate the appropriate margins from that...
          const monWidth = hyprland.monitors[hyprland.active.monitor.id].width;
          const monHeight =
            hyprland.monitors[hyprland.active.monitor.id].height;
          const marginLeft = value[0] - 100;
          const marginRight = monWidth - value[0] - 100;
          const marginTop = 40;
          const marginBottom = monHeight + 40 - 10;
          self.set_margin_left(marginLeft);
          self.set_margin_right(marginRight);
          self.set_margin_top(marginTop);
          self.set_margin_bottom(marginBottom);
        }),
      // margin_left: 3625, //marginLeft.bind("value"),
      // margin_right: 15, // marginRight.bind("value"),
      // margin_top: 40, //marginTop.bind("value"),
      // margin_bottom: 1360, //marginBottom.bind("value"),
      children: [
        Widget.Button({
          class_name: "click-me",
          child: Widget.Box({
            child: Widget.Label("Click Me"),
          }),
          on_clicked: () => console.log("CLICKED ME"),
        }),
      ],
    }),
  });
};
