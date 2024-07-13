import GLib from "gi://GLib";
import { notifHasImg } from "../../menus/notifications/utils.js";
import { NotificationIcon } from "./icon.js";

const time = (time, format = "%I:%M %p") =>
  GLib.DateTime.new_from_unix_local(time).format(format);

export const Header = (notif) => {
  return Widget.Box({
    vertical: false,
    hexpand: true,
    children: [
      Widget.Box({
        class_name: "notification-card-header",
        hpack: "start",
        children: [NotificationIcon(notif)],
      }),
      Widget.Box({
        class_name: "notification-card-header",
        hexpand: true,
        hpack: "start",
        vpack: "start",
        children: [
          Widget.Label({
            class_name: "notification-card-header-label",
            hpack: "start",
            hexpand: true,
            vexpand: true,
            max_width_chars: !notifHasImg(notif) ? 30 : 19,
            truncate: "end",
            wrap: true,
            label: notif["summary"],
          }),
        ],
      }),
      Widget.Box({
        class_name: "notification-card-header menu",
        hpack: "end",
        vpack: "start",
        hexpand: true,
        child: Widget.Label({
          vexpand: true,
          class_name: "notification-time",
          label: time(notif.time),
        }),
      }),
    ],
  });
};
