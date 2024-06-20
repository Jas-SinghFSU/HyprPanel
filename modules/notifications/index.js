const notifs = await Service.import("notifications");

export default () => {
  notifs.popupTimeout = 7000;

  return Widget.Window({
    name: "notifications-window",
    class_name: "notifications-window",
    layer: "overlay",
    anchor: ["top","right"],
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
                  vpack: "center",
                  vexpand: false,
                  child: Widget.Box({
                    hpack: "center",
                    vexpand: false,
                    class_name: "notification-card-image",
                    css: `background-image: url("${notif.image}")`,
                  }),
                }),
              ];
            }

            return [];
          };

          const actionsContainer = (notif) => {
            if (notif.actions !== undefined && notif.actions.length > 0) {
              return [
                Widget.Box({
                  class_name: "notification-card-actions",
                  hpack: "start",
                  children: notif.actions.map((action) => {
                    return Widget.Button({
                      class_name: "notification-action-buttons",
                      on_primary_click: () => {
                        notif.invoke(action.id);
                      },
                      child: Widget.Box({
                        hpack: "center",
                        children: [
                          Widget.Label({
                            class_name: "notification-action-buttons-label",
                            label: action.label,
                          }),
                        ],
                      }),
                    });
                  }),
                }),
              ];
            }

            return [];
          };

          return (self.children = notifs.popups.map((notif, index) => {
            // FIX: Bottom part of notification gets cut of... need to find and fix culprit
            return Widget.Box({
              class_name: "notification-card",
              children: [
                ...imageContainer(notif),
                Widget.Box({
                  vertical: true,
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
                      children: [
                        Widget.Label({
                          class_name: "notification-card-body-label",
                          useMarkup: true,
                          lines: 2,
                          wrap: true,
                          maxWidthChars: 30,
                          truncate: "end",
                          label: notif["body"],
                        }),
                      ],
                    }),
                    ...actionsContainer(notif),
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
            });
          }));
        });
      },
    }),
  });
};
