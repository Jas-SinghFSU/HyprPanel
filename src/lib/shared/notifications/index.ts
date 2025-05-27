import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Variable } from 'astal';
import { iconExists } from 'src/lib/icons/helpers';
import icons from 'src/lib/icons/icons';

const normalizeName = (name: string): string => name.toLowerCase().replace(/\s+/g, '_');

export const removingNotifications = Variable(false);

export const isNotificationIgnored = (
    notification: AstalNotifd.Notification | null,
    filter: string[],
): boolean => {
    if (!notification) {
        return false;
    }

    const notificationFilters = new Set(filter.map(normalizeName));
    const normalizedAppName = normalizeName(notification.app_name);

    return notificationFilters.has(normalizedAppName);
};

export const filterNotifications = (
    notifications: AstalNotifd.Notification[],
    filter: string[],
): AstalNotifd.Notification[] => {
    const filteredNotifications = notifications.filter((notif: AstalNotifd.Notification) => {
        return !isNotificationIgnored(notif, filter);
    });

    return filteredNotifications;
};

export const getNotificationIcon = (app_name: string, app_icon: string, app_entry: string): string => {
    const icon = icons.fallback.notification;

    if (iconExists(app_name)) {
        return app_name;
    } else if (app_name && iconExists(app_name.toLowerCase())) {
        return app_name.toLowerCase();
    }

    if (app_icon && iconExists(app_icon)) {
        return app_icon;
    }

    if (app_entry && iconExists(app_entry)) {
        return app_entry;
    }

    return icon;
};

export const clearNotifications = async (
    notifications: AstalNotifd.Notification[],
    delay: number,
): Promise<void> => {
    removingNotifications.set(true);
    for (const notification of notifications) {
        notification.dismiss();
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    removingNotifications.set(false);
};
