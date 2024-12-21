import { notifdService } from 'src/lib/constants/services';
import icons from 'src/lib/icons/icons2';
import options from 'src/options';
import { errorHandler, lookUpIcon } from 'src/lib/utils';
import { Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';

const { clearDelay } = options.notifications;

export const removingNotifications = Variable<boolean>(false);

export const getNotificationIcon = (app_name: string, app_icon: string, app_entry: string): string => {
    let icon: string = icons.fallback.notification;

    if (lookUpIcon(app_name) || lookUpIcon(app_name.toLowerCase() || '')) {
        icon = lookUpIcon(app_name) ? app_name : lookUpIcon(app_name.toLowerCase()) ? app_name.toLowerCase() : '';
    }

    if (lookUpIcon(app_icon) && icon === '') {
        icon = app_icon;
    }

    if (lookUpIcon(app_entry || '') && icon === '') {
        icon = app_entry || '';
    }

    return icon;
};

export const clearNotifications = async (notifications: AstalNotifd.Notification[], delay: number): Promise<void> => {
    removingNotifications.set(true);
    for (const notification of notifications) {
        notification.dismiss();
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    removingNotifications.set(false);
};

const clearAllNotifications = async (): Promise<void> => {
    try {
        clearNotifications(notifdService.get_notifications(), clearDelay.get());
    } catch (error) {
        errorHandler(error);
    }
};

globalThis['removingNotifications'] = removingNotifications;
globalThis['clearAllNotifications'] = clearAllNotifications;
