const notifs = await Service.import("notifications");

export default () => {
  notifs.popupTimeout = 7000;

  return Widget.Window({
    name: "notifications-window",
    class_name: "notifications-window",
    layer: "top",
    anchor: ["top", "right"],
    monitor: 2,
    exclusivity: "ignore",
    child: Widget.Box({
      vertical: true,
      class_name: "notification-card-container",
      setup: (self) => {
        self.hook(notifs, () => {
          if (notifs.dnd) {
            return;
          }

          const imageContainer = (notif) => {
            if (notif.image !== undefined) {
              return [
                Widget.Box({
                  class_name: "notification-card-image-container",
                  hpack: "center",
                  vexpand: true,
                  child: Widget.Box({
                    hpack: "center",
                    vexpand: true,
                    class_name: "notification-card-image",
                    css: `background-image: url("${notif.image}")`,
                  }),
                }),
              ];
            }

            return [];
          };

          return (self.children = notifs.popups.map((notif, index) => {
            return Widget.Button({
              on_primary_click: () => { 
                notifs.CloseNotification(notif.id);
              },
              on_secondary_click: () => { 
                notifs.CloseNotification(notif.id);
              },
              child: Widget.Box({
                class_name: "notification-card",
                children: [
                  ...imageContainer(notif),
                  Widget.Box({
                    vertical: true,
                    hpack: "end",
                    class_name: "notification-card-content",
                    children: [
                      Widget.Box({
                        class_name: "notification-card-header",
                        children: [
                          Widget.Label({
                            class_name: "notification-card-header-label",
                            truncate: "end",
                            wrap: true,
                            label: notif["summary"],
                          }),
                        ],
                      }),
                      Widget.Box({
                        class_name: "notification-card-body",
                        vexpand: true,
                        children: [
                          Widget.Label({
                            class_name: "notification-card-body-label",
                            useMarkup: true,
                            lines: 2,
                            wrap: true,
                            truncate: "end",
                            label: notif["body"],
                          }),
                        ],
                      }),
                      Widget.Box({
                        class_name: "notification-card-appname",
                        children: [
                          Widget.Label({
                            class_name: "notification-card-appname-label",
                            truncate: "end",
                            wrap: true,
                            label: notif["app-name"].toUpperCase(),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            });
          }));
        });
      },
    }),
  });
};
