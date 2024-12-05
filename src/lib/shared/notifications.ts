import AstalNotifd from 'gi://AstalNotifd?version=0.1';

const normalizeName = (name: string): string => name.toLowerCase().replace(/\s+/g, '_');

export const isNotificationIgnored = (notification: AstalNotifd.Notification, filter: string[]): boolean => {
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
