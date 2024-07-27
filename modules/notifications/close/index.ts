import { Notification, Notifications } from "types/service/notifications";

export const CloseButton = (notif: Notification, notifs: Notifications) => {
    return Widget.Button({
        class_name: "close-notification-button",
        on_primary_click: () => {
            notifs.CloseNotification(notif.id);
        },
        child: Widget.Label({
            label: "󰅜",
            hpack: "center",
        }),
    });
};
