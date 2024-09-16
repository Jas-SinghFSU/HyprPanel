import { Attribute, Child } from 'lib/types/widget';
import { Notification, Notifications } from 'types/service/notifications';
import Button from 'types/widgets/button';
import Label from 'types/widgets/label';

export const CloseButton = (notif: Notification, notifs: Notifications): Button<Label<Child>, Attribute> => {
    return Widget.Button({
        class_name: 'close-notification-button',
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
