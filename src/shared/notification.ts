import icons from 'src/lib/icons/icons2';
import { Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import options from 'src/configuration';
import { lookUpIcon } from 'src/lib/icons/helpers';
import { errorHandler } from 'src/core';

const notifdService = AstalNotifd.get_default();
const { clearDelay } = options.notifications;

export const removingNotifications = Variable<boolean>(false);

export const getNotificationIcon = (app_name: string, app_icon: string, app_entry: string): string => {
    const icon = icons.fallback.notification;

    if (lookUpIcon(app_name)) {
        return app_name;
    } else if (app_name && lookUpIcon(app_name.toLowerCase())) {
        return app_name.toLowerCase();
    }

    if (app_icon && lookUpIcon(app_icon)) {
        return app_icon;
    }

    if (app_entry && lookUpIcon(app_entry)) {
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

export async function clearAllNotifications(): Promise<void> {
    try {
        clearNotifications(notifdService.get_notifications(), clearDelay.get());
    } catch (error) {
        errorHandler(error);
    }
}
