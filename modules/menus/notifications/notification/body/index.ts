import { BoxWidget } from 'lib/types/widget.js';
import { notifHasImg } from '../../utils.js';
import { Notification } from 'types/service/notifications';

export const Body = (notif: Notification): BoxWidget => {
    return Widget.Box({
        vpack: 'start',
        hexpand: true,
        class_name: 'notification-card-body menu',
        children: [
            Widget.Label({
                hexpand: true,
                use_markup: true,
                xalign: 0,
                justification: 'left',
                truncate: 'end',
                lines: 2,
                max_width_chars: !notifHasImg(notif) ? 35 : 28,
                wrap: true,
                class_name: 'notification-card-body-label menu',
                label: notif['body'],
            }),
        ],
    });
};
