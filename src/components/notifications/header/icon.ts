import { Notification } from 'types/service/notifications.js';
import { getNotificationIcon } from 'src/globals/notification.js';
import Box from 'types/widgets/box';
import { Attribute, Child } from 'src/lib/types/widget';

const NotificationIcon = ({
    app_entry = '',
    app_icon = '',
    app_name = '',
}: Partial<Notification>): Box<Child, Attribute> => {
    return Widget.Box({
        css: `
            min-width: 2rem;
            min-height: 2rem;
        `,
        child: Widget.Icon({
            class_name: 'notification-icon',
            icon: getNotificationIcon(app_name, app_icon, app_entry),
        }),
    });
};

export { NotificationIcon };
