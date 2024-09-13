import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from '../utils.js';
import options from 'options';
import { filterNotifications } from 'lib/shared/notifications.js';
import { BarBoxChild, SelfButton } from 'lib/types/bar.js';

const { show_total } = options.bar.notifications;
const { ignore } = options.notifications;

const notifs = await Service.import('notifications');

export const Notifications = (): BarBoxChild => {
    return {
        component: Widget.Box({
            hpack: 'start',
            className: Utils.merge(
                [options.theme.bar.buttons.style.bind('value'), show_total.bind('value')],
                (style, showTotal) => {
                    const styleMap = {
                        default: 'style1',
                        split: 'style2',
                        wave: 'style3',
                        wave2: 'style3',
                    };
                    return `notifications ${styleMap[style]} ${!showTotal ? 'no-label' : ''}`;
                },
            ),
            child: Widget.Box({
                hpack: 'start',
                class_name: 'bar-notifications',
                children: Utils.merge(
                    [notifs.bind('notifications'), notifs.bind('dnd'), show_total.bind('value'), ignore.bind('value')],
                    (notif, dnd, showTotal, ignoredNotifs) => {
                        const filteredNotifications = filterNotifications(notif, ignoredNotifs);

                        const notifIcon = Widget.Label({
                            hpack: 'center',
                            class_name: 'bar-button-icon notifications txt-icon bar',
                            label: dnd ? '󰂛' : filteredNotifications.length > 0 ? '󱅫' : '󰂚',
                        });

                        const notifLabel = Widget.Label({
                            hpack: 'center',
                            class_name: 'bar-button-label notifications',
                            label: filteredNotifications.length.toString(),
                        });

                        if (showTotal) {
                            return [notifIcon, notifLabel];
                        }
                        return [notifIcon];
                    },
                ),
            }),
        }),
        isVisible: true,
        boxClass: 'notifications',
        props: {
            on_primary_click: (clicked: SelfButton, event: Gdk.Event): void => {
                openMenu(clicked, event, 'notificationsmenu');
            },
        },
    };
};
