import { openMenu } from "../utils.js";

const notifs = await Service.import("notifications");

export const Notifications = () => {
  return {
    component: Widget.Box({
      hpack: "start",
      child: Widget.Box({
        hpack: "start",
        class_name: "bar-notifications",
        child: Widget.Label({
          hpack: "center",
          class_name: "bar-notifications-label",
          setup: (self) => {
            self.hook(notifs, () => {
              if (notifs.dnd) {
                return (self.label = "󰂛");
              } else if (notifs.notifications.length > 0) {
                return (self.label = "󱅫");
              } else {
                return (self.label = "󰂚");
              }
            });
          },
        }),
      }),
    }),
    isVisible: true,
    boxClass: "notifications",
    props: {
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "notificationsmenu");
      },
    },
  };
};
