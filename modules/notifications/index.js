const notifs = await Service.import("notifications");
import GLib from "gi://GLib";
import icons from "../icons/index.js";

export default () => {
  notifs.popupTimeout = 7000;

  const time = (time, format = "%I:%M %p") =>
    GLib.DateTime.new_from_unix_local(time).format(format);

  return Widget.Window({
    name: "notifications-window",
    class_name: "notifications-window",
    monitor: 2,
    layer: "top",
    anchor: ["top", "right"],
    exclusivity: "ignore",
    child: Widget.Box({
      class_name: "notification-card-container",
      vertical: true,
      hexpand: true,
      setup: (self) => {
        self.hook(notifs, () => {
          const notifHasImg = (notif) => {
            return notif.image !== undefined && notif.image.length;
          };
          const imageContainer = (notif) => {
            if (notifHasImg(notif)) {
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
                  hexpand: true,
                  vpack: "end",
                  children: notif.actions.map((action) => {
                    return Widget.Button({
                      hexpand: true,
                      class_name: "notification-action-buttons",
                      on_primary_click: () => {
                        if (action.id.includes("scriptAction:-")) {
                          Utils.execAsync(
                            `${action.id.replace("scriptAction:-", "")}`,
                          ).catch((err) => console.error(err));
                          notifs.CloseNotification(notif.id);
                        } else {
                          notif.invoke(action.id);
                        }
                      },
                      child: Widget.Box({
                        hpack: "center",
                        hexpand: true,
                        children: [
                          Widget.Label({
                            class_name: "notification-action-buttons-label",
                            hexpand: true,
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

          const NotificationIcon = ({ app_entry, app_icon, app_name }) => {
            let icon = icons.fallback.notification;

            if (
              Utils.lookUpIcon(app_name) ||
              Utils.lookUpIcon(app_name.toLowerCase() || "")
            )
              icon = Utils.lookUpIcon(app_name)
                ? app_name
                : Utils.lookUpIcon(app_name.toLowerCase())
                  ? app_name.toLowerCase()
                  : "";

            if (Utils.lookUpIcon(app_icon) && icon === "") icon = app_icon;

            if (Utils.lookUpIcon(app_entry || "") && icon === "")
              icon = app_entry || "";

            return Widget.Box({
              css: `
            min-width: 2rem;
            min-height: 2rem;
        `,
              child: Widget.Icon({
                class_name: "notification-icon",
                icon,
              }),
            });
          };

          return (self.children = notifs.popups.map((notif) => {
            return Widget.Box({
              class_name: "notification-card",
              vpack: "start",
              hexpand: true,
              children: [
                ...imageContainer(notif),
                Widget.Box({
                  vpack: "start",
                  vertical: true,
                  hexpand: true,
                  class_name: `notification-card-content ${!notifHasImg(notif) ? "noimg" : ""}`,
                  children: [
                    Widget.Box({
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
                              max_width_chars: !notifHasImg(notif) ? 30 : 23,
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
                    }),
                    Widget.Box({
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
                    }),
                    ...actionsContainer(notif),
                  ],
                }),
                Widget.Button({
                  class_name: "close-notification-button",
                  on_primary_click: () => {
                    notifs.CloseNotification(notif.id);
                  },
                  child: Widget.Label({
                    label: "󰅜",
                    hpack: "center",
                  }),
                }),
              ],
            });
          }));
        });
      },
    }),
  });
};
