import { Notification } from 'types/service/notifications';

export const filterNotifications = (notifications: Notification[], filter: string[]): Notification[] => {
    const notifFilter = new Set(filter.map((name: string) => name.toLowerCase().replace(/\s+/g, '_')));

    const filteredNotifications = notifications.filter((notif: Notification) => {
        const normalizedAppName = notif.app_name.toLowerCase().replace(/\s+/g, '_');
        return !notifFilter.has(normalizedAppName);
    });

    return filteredNotifications;
};
