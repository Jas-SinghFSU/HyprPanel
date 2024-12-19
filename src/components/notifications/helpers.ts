import { bind, timeout, Variable } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import options from 'src/options';
import { hyprlandService, notifdService } from 'src/lib/constants/services';
import { isNotificationIgnored } from 'src/lib/shared/notifications';

const { ignore, timeout: popupTimeout } = options.notifications;

/**
 * Checks if a notification has an image.
 *
 * This function determines whether the provided notification contains an image by checking the `image` property.
 *
 * @param notification The notification object to check.
 *
 * @returns True if the notification has an image, false otherwise.
 */
export const notifHasImg = (notification: AstalNotifd.Notification): boolean => {
    return (notification.image && notification.image.length) || notification.appIcon ? true : false;
};

/**
 * Tracks the active monitor and updates the provided variable.
 *
 * This function sets up a derived variable that updates the `curMonitor` variable with the ID of the focused monitor.
 *
 * @param curMonitor The variable to update with the active monitor ID.
 */
export const trackActiveMonitor = (curMonitor: Variable<number>): void => {
    Variable.derive([bind(hyprlandService, 'focusedMonitor')], (monitor) => {
        curMonitor.set(monitor.id);
    });
};

/**
 * Tracks popup notifications and updates the provided variable.
 *
 * This function connects to the `notified` and `resolved` signals of the `notifdService` to manage popup notifications.
 * It updates the `popupNotifications` variable with the current list of notifications and handles dismissing notifications based on the timeout.
 *
 * @param popupNotifications The variable to update with the list of popup notifications.
 */
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

/**
 * Dismisses a notification popup and updates the provided variable.
 *
 * This function removes the specified notification from the list of popup notifications and updates the `popupNotifications` variable.
 *
 * @param notificationToDismiss The notification to dismiss.
 * @param popupNotifications The variable to update with the list of popup notifications.
 */
const dropNotificationPopup = (
    notificationToDismiss: AstalNotifd.Notification,
    popupNotifications: Variable<AstalNotifd.Notification[]>,
): void => {
    const currentPopups = popupNotifications.get();
    const undismissedNotifications = currentPopups.filter((popupNotif) => popupNotif.id !== notificationToDismiss.id);

    popupNotifications.set(undismissedNotifications);
};
