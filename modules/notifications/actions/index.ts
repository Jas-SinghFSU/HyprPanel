import { Attribute, Child } from 'lib/types/widget';
import { Notification, Notifications } from 'types/service/notifications';
import Box from 'types/widgets/box';

const Action = (notif: Notification, notifs: Notifications): Box<Child, Attribute> => {
    if (notif.actions !== undefined && notif.actions.length > 0) {
        return Widget.Box({
            class_name: 'notification-card-actions',
            hexpand: true,
            vpack: 'end',
            children: notif.actions.map((action) => {
                return Widget.Button({
                    hexpand: true,
                    class_name: 'notification-action-buttons',
                    on_primary_click: () => {
                        if (action.id.includes('scriptAction:-')) {
                            Utils.execAsync(`${action.id.replace('scriptAction:-', '')}`).catch((err) =>
                                console.error(err),
                            );
                            notifs.CloseNotification(notif.id);
                        } else {
                            notif.invoke(action.id);
                        }
                    },
                    child: Widget.Box({
                        hpack: 'center',
                        hexpand: true,
                        children: [
                            Widget.Label({
                                class_name: 'notification-action-buttons-label',
                                hexpand: true,
                                label: action.label,
                                max_width_chars: 15,
                                truncate: 'end',
                                wrap: true,
                            }),
                        ],
                    }),
                });
            }),
        });
    }

    return Widget.Box();
};

export { Action };
