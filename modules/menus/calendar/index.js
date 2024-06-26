import PopupWindow from "../PopupWindow.js";
import icons from "../../icons/index.js";

export default () => {
  return PopupWindow({
    name: "calendarmenu",
    visible: false,
    transition: "crossfade",
    layout: "top-right",
    child: Widget.Box({
      class_name: "calendar-menu-content",
      css: "padding: 1px; margin: -1px;",
      vexpand: false,
      children: [
        Widget.Box({
          class_name: "calendar-content-container",
          children: [
            Widget.Box({
              class_name: "calendar-content-items",
              children: [
                Widget.Calendar({
                  class_name: "calendar-menu-calendar",
                  showDayNames: true,
                  showDetails: true,
                  showHeading: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
