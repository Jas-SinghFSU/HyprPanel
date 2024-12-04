import AstalNotifd from 'gi://AstalNotifd?version=0.1';

const notifHasImg = (notification: AstalNotifd.Notification): boolean => {
    return notification.image && notification.image.length ? true : false;
};

export { notifHasImg };
