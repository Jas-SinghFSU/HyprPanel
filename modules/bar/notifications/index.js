const notifs = await Service.import("notifications");

export const Notifications = () => {
  notifs.connect("changed", () => {
    console.log(JSON.stringify(notifs, null, 2));
  });
  return {
    component: Widget.Box({
      hpack: "start",
      hexpand: true,
      child: Widget.Button({
        hpack: "start",
        hexpand: true,
        class_name: "bar-notifications",
        child: Widget.Label({
          hpack: "start",
          hexpand: true,
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
    props: {
      on_primary_click: () => App.toggleWindow("notificationsmenu"),
    },
  };
};
