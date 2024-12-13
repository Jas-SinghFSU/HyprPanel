import { bind, timeout, Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import options from 'src/options';
import { hyprlandService, notifdService } from 'src/lib/constants/services';
import { isNotificationIgnored } from 'src/lib/shared/notifications';

const { ignore, timeout: popupTimeout } = options.notifications;

export const notifHasImg = (notification: AstalNotifd.Notification): boolean => {
    return notification.image && notification.image.length ? true : false;
};

export const trackActiveMonitor = (curMonitor: Variable<number>): void => {
    Variable.derive([bind(hyprlandService, 'focusedMonitor')], (monitor) => {
        curMonitor.set(monitor.id);
    });
};

export const trackPopupNotifications = (popupNotifications: Variable<AstalNotifd.Notification[]>): void => {
    notifdService.connect('notified', (_, id) => {
        const notification = notifdService.get_notification(id);
        const doNotDisturb = notifdService.dontDisturb;

        if (isNotificationIgnored(notification, ignore.get())) {
            notification.dismiss();
            return;
        }

        if (doNotDisturb) {
            return;
        }

        popupNotifications.set([...popupNotifications.get(), notification]);

        timeout(popupTimeout.get(), () => {
            dropNotificationPopup(notification, popupNotifications);
        });
    });

    notifdService.connect('resolved', (_, id) => {
        const filteredPopups = popupNotifications.get().filter((popupNotif) => popupNotif.id !== id);

        popupNotifications.set(filteredPopups);
    });
};

const dropNotificationPopup = (
    notificationToDismiss: AstalNotifd.Notification,
    popupNotifications: Variable<AstalNotifd.Notification[]>,
): void => {
    const currentPopups = popupNotifications.get();
    const undismissedNotifications = currentPopups.filter((popupNotif) => popupNotif.id !== notificationToDismiss.id);

    popupNotifications.set(undismissedNotifications);
};
