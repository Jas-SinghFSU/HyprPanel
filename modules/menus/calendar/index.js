import DropdownMenu from "../DropdownMenu.js";
import { TimeWidget } from "./time/index.js";
import { CalendarWidget } from "./calendar.js";
import { WeatherWidget } from "./weather/index.js";

export default () => {
  return DropdownMenu({
    name: "calendarmenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "calendar-menu-content",
      css: "padding: 1px; margin: -1px;",
      vexpand: false,
      children: [
        Widget.Box({
          class_name: "calendar-content-container",
          vertical: true,
          children: [
            Widget.Box({
              class_name: "calendar-content-items",
              vertical: true,
              children: [TimeWidget(), CalendarWidget(), WeatherWidget()],
            }),
          ],
        }),
      ],
    }),
  });
};
