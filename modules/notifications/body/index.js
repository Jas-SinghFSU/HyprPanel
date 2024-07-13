import { notifHasImg } from "../../menus/notifications/utils.js";

export const Body = (notif) => {
  return Widget.Box({
    vpack: "start",
    hexpand: true,
    class_name: "notification-card-body",
    children: [
      Widget.Label({
        hexpand: true,
        use_markup: true,
        xalign: 0,
        justification: "left",
        truncate: "end",
        lines: 2,
        max_width_chars: !notifHasImg(notif) ? 35 : 28,
        wrap: true,
        class_name: "notification-card-body-label",
        label: notif["body"],
      }),
    ],
  });
};
