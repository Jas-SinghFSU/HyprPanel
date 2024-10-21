import Gdk from 'gi://Gdk?version=3.0';
import { openMenu } from '../utils.js';
import options from 'options';
import { filterNotifications } from 'lib/shared/notifications.js';
import { BarBoxChild } from 'lib/types/bar.js';
import Button from 'types/widgets/button.js';
import { Attribute, Child } from 'lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'customModules/utils.js';

const { show_total, rightClick, middleClick, scrollUp, scrollDown, hideCountWhenZero } = options.bar.notifications;
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
                    return `notifications-container ${styleMap[style]} ${!showTotal ? 'no-label' : ''}`;
                },
            ),
            child: Widget.Box({
                hpack: 'start',
                class_name: 'bar-notifications',
                children: Utils.merge(
                    [
                        notifs.bind('notifications'),
                        notifs.bind('dnd'),
                        show_total.bind('value'),
                        ignore.bind('value'),
                        hideCountWhenZero.bind('value'),
                    ],
                    (notif, dnd, showTotal, ignoredNotifs, hideCountForZero) => {
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
                            if (hideCountForZero && filteredNotifications.length === 0) {
                                return [notifIcon];
                            }
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
            on_primary_click: (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                openMenu(clicked, event, 'notificationsmenu');
            },
            setup: (self: Button<Child, Attribute>): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_secondary_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: Button<Child, Attribute>, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};
