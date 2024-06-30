import PopupWindow from "../PopupWindow.js";
const notifs = await Service.import("notifications");
import icons from "../../icons/index.js";

export default () => {
  notifs.popupTimeout = 5000;

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
          children: [
            Widget.Box({
              class_name: "notification-menu-controls",
              expand: false,
              vertical: false,
              children: [
                Widget.Box({
                  class_name: "menu-label-container notifications",
                  hpack: "start",
                  vpack: "center",
                  expand: true,
                  children: [
                    Widget.Label({
                      class_name: "menu-label notifications",
                      label: "Notifications",
                    }),
                  ],
                }),
                Widget.Box({
                  hpack: "end",
                  vpack: "center",
                  expand: false,
                  children: [
                    Widget.Switch({
                      class_name: "menu-switch notifications",
                      active: notifs.bind("dnd").as((dnd) => !dnd),
                      on_activate: ({ active }) => {
                        notifs.dnd = !active;
                      },
                    }),
                    Widget.Box({
                      children: [
                        Widget.Separator({
                          hpack: "center",
                          vexpand: true,
                          vertical: true,
                          class_name: "menu-separator notification-controls",
                        }),
                        Widget.Button({
                          class_name: "clear-notifications-button",
                          tooltip_text: "Clear Notifications",
                          on_primary_click: () => notifs.clear(),
                          child: Widget.Label({
                            class_name: "clear-notifications-label",
                            label: "",
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            Widget.Box({
              class_name: "menu-content-container notifications",
              hpack: "center",
              vexpand: false,
              spacing: 0,
              vertical: true,
              setup: (self) => {
                self.hook(notifs, () => {
                  console.log(JSON.stringify(notifs, null, 2));

                  const notifHasImg = (notif) => {
                    return notif.image !== undefined && notif.image.length;
                  };
                  const imageContainer = (notif) => {
                    if (notifHasImg(notif)) {
                      return [
                        Widget.Box({
                          class_name: "notification-card-image-container menu",
                          hpack: "center",
                          vpack: "center",
                          vexpand: false,
                          child: Widget.Box({
                            hpack: "center",
                            vexpand: false,
                            class_name: "notification-card-image menu",
                            css: `background-image: url("${notif.image}")`,
                          }),
                        }),
                      ];
                    }

                    return [];
                  };

                  const actionsContainer = (notif) => {
                    if (
                      notif.actions !== undefined &&
                      notif.actions.length > 0
                    ) {
                      return [
                        Widget.Box({
                          class_name: "notification-card-actions menu",
                          hexpand: true,
                          vpack: "end",
                          children: notif.actions.map((action) => {
                            return Widget.Button({
                              hexpand: true,
                              class_name: "notification-action-buttons menu",
                              on_primary_click: () => {
                                notif.invoke(action.id);
                              },
                              child: Widget.Box({
                                hpack: "center",
                                hexpand: true,
                                children: [
                                  Widget.Label({
                                    class_name:
                                      "notification-action-buttons-label menu",
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

                    return [Widget.Box({
                      class_name: "spacer"
                    })];
                  };

                  const NotificationIcon = ({
                    app_entry,
                    app_icon,
                    app_name,
                  }) => {
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

                    if (Utils.lookUpIcon(app_icon) && icon === "")
                      icon = app_icon;

                    if (Utils.lookUpIcon(app_entry || "") && icon === "")
                      icon = app_entry || "";

                    return Widget.Box({
                      css: `
                min-width: 2rem;
                min-height: 2rem;
              `,
                      child: Widget.Icon({
                        class_name: "notification-icon menu",
                        icon,
                      }),
                    });
                  };

                  const sortedNotifications = notifs.notifications.sort(
                    (a, b) => b.time - a.time,
                  );

                  if (notifs.notifications.length <= 0) {
                    return (self.children = [
                      Widget.Box({
                        vpack: "center",
                        hpack: "center",
                        expand: true,
                        child: Widget.Label({
                          class_name: "placehold-label dim",
                          label: "You're all caught up :)",
                        }),
                      }),
                    ]);
                  }

                  return (self.children = sortedNotifications.map((notif) => {
                    return Widget.Box({
                      class_name: "notification-card-content-container",
                      children: [
                        Widget.Box({
                          class_name: "notification-card menu",
                          vpack: "center",
                          hexpand: true,
                          children: [
                            ...imageContainer(notif),
                            Widget.Box({
                              vpack: "center",
                              vertical: true,
                              hexpand: true,
                              class_name: `notification-card-content ${!notifHasImg(notif) ? "noimg" : " menu"}`,
                              children: [
                                Widget.Box({
                                  vertical: false,
                                  hexpand: true,
                                  children: [
                                    Widget.Box({
                                      class_name:
                                        "notification-card-header menu",
                                      hexpand: true,
                                      vpack: "start",
                                      children: [
                                        Widget.Label({
                                          class_name:
                                            "notification-card-header-label menu",
                                          hpack: "start",
                                          hexpand: true,
                                          vexpand: true,
                                          max_width_chars: !notifHasImg(notif)
                                            ? 27
                                            : 20,
                                          truncate: "end",
                                          wrap: true,
                                          label: notif["summary"],
                                        }),
                                      ],
                                    }),
                                    Widget.Box({
                                      class_name:
                                        "notification-card-header menu",
                                      hexpand: true,
                                      hpack: "end",
                                      children: [NotificationIcon(notif)],
                                    }),
                                  ],
                                }),
                                Widget.Box({
                                  vpack: "start",
                                  hexpand: true,
                                  class_name: "notification-card-body menu",
                                  children: [
                                    Widget.Label({
                                      hexpand: true,
                                      use_markup: true,
                                      xalign: 0,
                                      justification: "left",
                                      truncate: "end",
                                      lines: 2,
                                      max_width_chars: !notifHasImg(notif)
                                        ? 35
                                        : 28,
                                      wrap: true,
                                      class_name:
                                        "notification-card-body-label menu",
                                      label: notif["body"],
                                    }),
                                  ],
                                }),
                                ...actionsContainer(notif),
                              ],
                            }),
                          ],
                        }),
                        Widget.Button({
                          class_name: "close-notification-button menu",
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
          ],
        }),
      ],
    }),
  });
};
