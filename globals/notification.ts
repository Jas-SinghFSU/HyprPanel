import icons from 'modules/icons/index';
import { Notification } from 'types/service/notifications';

export const removingNotifications = Variable<boolean>(false);

export const getNotificationIcon = (app_name: string, app_icon: string, app_entry: string): string => {
    let icon: string = icons.fallback.notification;

    if (Utils.lookUpIcon(app_name) || Utils.lookUpIcon(app_name.toLowerCase() || '')) {
        icon = Utils.lookUpIcon(app_name)
            ? app_name
            : Utils.lookUpIcon(app_name.toLowerCase())
              ? app_name.toLowerCase()
              : '';
    }

    if (Utils.lookUpIcon(app_icon) && icon === '') {
        icon = app_icon;
    }

    if (Utils.lookUpIcon(app_entry || '') && icon === '') {
        icon = app_entry || '';
    }

    return icon;
};

export const closeNotifications = async (notifications: Notification[], delay: number): Promise<void> => {
    removingNotifications.value = true;
    for (const notif of notifications) {
        notif.close();
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    removingNotifications.value = false;
};

globalThis['removingNotifications'] = removingNotifications;
