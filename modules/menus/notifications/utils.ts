import { Notification } from "types/service/notifications";

const notifHasImg = (notif: Notification) => {
    return notif.image !== undefined && notif.image.length;
};

export { notifHasImg };
