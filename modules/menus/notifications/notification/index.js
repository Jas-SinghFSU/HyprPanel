import { notifHasImg } from "../utils.js";
import { Header } from "./header/index.js";
import { Actions } from "./actions/index.js";
import { Image } from "./image/index.js";
import { Placeholder } from "./placeholder/index.js";
import { Body } from "./body/index.js";
import { CloseButton } from "./close/index.js";

const NotificationCard = (notifs) => {
  return Widget.Box({
    class_name: "menu-content-container notifications",
    hpack: "center",
    vexpand: true,
    spacing: 0,
    vertical: true,
    setup: (self) => {
      self.hook(notifs, () => {
        const sortedNotifications = notifs.notifications.sort(
          (a, b) => b.time - a.time,
        );

        if (notifs.notifications.length <= 0) {
          return (self.children = [Placeholder(notifs)]);
        }

        return (self.children = sortedNotifications.map((notif) => {
          return Widget.Box({
            class_name: "notification-card-content-container",
            children: [
              Widget.Box({
                class_name: "notification-card menu",
                vpack: "start",
                hexpand: true,
                vexpand: false,
                children: [
                  Image(notif),
                  Widget.Box({
                    vpack: "center",
                    vertical: true,
                    hexpand: true,
                    class_name: `notification-card-content ${!notifHasImg(notif) ? "noimg" : " menu"}`,
                    children: [
                      Header(notif),
                      Body(notif),
                      Actions(notif, notifs),
                    ],
                  }),
                ],
              }),
              CloseButton(notif, notifs),
            ],
          });
        }));
      });
    },
  });
};

export { NotificationCard };
