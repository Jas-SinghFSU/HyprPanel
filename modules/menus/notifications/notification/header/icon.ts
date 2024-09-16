import { Notification } from 'types/service/notifications.js';
import { NotificationIcon } from 'lib/types/notification.js';
import { getNotificationIcon } from 'globals/notification';
import { BoxWidget } from 'lib/types/widget';

const NotificationIcon = ({ app_entry = '', app_icon = '', app_name = '' }: Partial<Notification>): BoxWidget => {
    return Widget.Box({
        css: `
                min-width: 2rem;
                min-height: 2rem;
              `,
        child: Widget.Icon({
            class_name: 'notification-icon menu',
            icon: getNotificationIcon(app_name, app_icon, app_entry),
        }),
    });
};

export { NotificationIcon };
