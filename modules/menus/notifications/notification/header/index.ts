import GLib from 'gi://GLib';
import { Notification } from 'types/service/notifications';
import { NotificationIcon } from './icon.js';
import { notifHasImg } from '../../utils.js';
import options from 'options.js';
import { BoxWidget } from 'lib/types/widget.js';

const { military } = options.menus.clock.time;

export const Header = (notif: Notification): BoxWidget => {
    const time = (time: number, format = '%I:%M %p'): string => {
        return GLib.DateTime.new_from_unix_local(time).format(military.value ? '%H:%M' : format) || '--:--';
    };

    return Widget.Box({
        vertical: false,
        hexpand: true,
        children: [
            Widget.Box({
                class_name: 'notification-card-header menu',
                hpack: 'start',
                children: [NotificationIcon(notif)],
            }),
            Widget.Box({
                class_name: 'notification-card-header menu',
                hexpand: true,
                vpack: 'start',
                children: [
                    Widget.Label({
                        class_name: 'notification-card-header-label menu',
                        hpack: 'start',
                        hexpand: true,
                        vexpand: true,
                        max_width_chars: !notifHasImg(notif) ? 34 : 22,
                        truncate: 'end',
                        wrap: true,
                        label: notif['summary'],
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'notification-card-header menu',
                hpack: 'end',
                vpack: 'start',
                hexpand: true,
                child: Widget.Label({
                    vexpand: true,
                    class_name: 'notification-time',
                    label: time(notif.time),
                }),
            }),
        ],
    });
};
