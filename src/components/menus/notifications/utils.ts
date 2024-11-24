import { Notification } from 'types/service/notifications';

const notifHasImg = (notif: Notification): boolean => {
    return notif.image !== undefined && notif.image.length ? true : false;
};

export { notifHasImg };
