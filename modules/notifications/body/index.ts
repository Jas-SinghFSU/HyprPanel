import { Notification } from 'types/service/notifications';
import { notifHasImg } from '../../menus/notifications/utils.js';
import Box from 'types/widgets/box.js';
import { Attribute, Child } from 'lib/types/widget.js';

export const Body = (notif: Notification): Box<Child, Attribute> => {
    return Widget.Box({
        vpack: 'start',
        hexpand: true,
        class_name: 'notification-card-body',
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
                class_name: 'notification-card-body-label',
                label: notif['body'],
            }),
        ],
    });
};
