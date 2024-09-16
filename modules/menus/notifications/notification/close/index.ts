import { Attribute } from 'lib/types/widget';
import { Notification, Notifications } from 'types/service/notifications';
import Button from 'types/widgets/button';
import Label from 'types/widgets/label';
export const CloseButton = (notif: Notification, notifs: Notifications): Button<Label<Attribute>, Attribute> => {
    return Widget.Button({
        class_name: 'close-notification-button menu',
        on_primary_click: () => {
            notifs.CloseNotification(notif.id);
        },
        child: Widget.Label({
            class_name: 'txt-icon notif-close',
            label: '󰅜',
            hpack: 'center',
        }),
    });
};
