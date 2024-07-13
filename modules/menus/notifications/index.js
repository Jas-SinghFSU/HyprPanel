import PopupWindow from "../PopupWindow.js";
const notifs = await Service.import("notifications");
import { Controls } from "./controls/index.js";
import { NotificationCard } from "./notification/index.js";

export default () => {
  return PopupWindow({
    name: "notificationsmenu",
    visible: false,
    transition: "crossfade",
    layout: "top-right",
    child: Widget.Box({
      class_name: "notification-menu-content",
      css: "padding: 1px; margin: -1px;",
      hexpand: true,
      vexpand: false,
      children: [
        Widget.Box({
          class_name: "notification-card-container menu",
          vertical: true,
          hexpand: false,
          vexpand: false,
          children: [Controls(notifs), NotificationCard(notifs)],
        }),
      ],
    }),
  });
};
