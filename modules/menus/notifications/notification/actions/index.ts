import { BoxWidget } from 'lib/types/widget';
import { Notification, Notifications } from 'types/service/notifications';
const Actions = (notif: Notification, notifs: Notifications): BoxWidget => {
    if (notif.actions !== undefined && notif.actions.length > 0) {
        return Widget.Box({
            class_name: 'notification-card-actions menu',
            hexpand: true,
            vpack: 'end',
            children: notif.actions.map((action) => {
                return Widget.Button({
                    hexpand: true,
                    class_name: 'notification-action-buttons menu',
                    on_primary_click: () => {
                        if (action.id.includes('scriptAction:-')) {
                            App.closeWindow('notificationsmenu');
                            Utils.execAsync(`${action.id.replace('scriptAction:-', '')}`).catch((err) =>
                                console.error(err),
                            );
                            notifs.CloseNotification(notif.id);
                        } else {
                            App.closeWindow('notificationsmenu');
                            notif.invoke(action.id);
                        }
                    },
                    child: Widget.Box({
                        hpack: 'center',
                        hexpand: true,
                        children: [
                            Widget.Label({
                                class_name: 'notification-action-buttons-label menu',
                                hexpand: true,
                                max_width_chars: 15,
                                truncate: 'end',
                                wrap: true,
                                label: action.label,
                            }),
                        ],
                    }),
                });
            }),
        });
    }

    return Widget.Box({
        class_name: 'spacer',
    });
};

export { Actions };
