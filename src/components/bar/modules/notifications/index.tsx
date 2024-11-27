import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Gtk } from 'astal/gtk3';
import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { filterNotifications } from 'src/lib/shared/notifications.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { useHook } from 'src/lib/shared/hookHandler';
import {
    connectMiddleClick,
    connectPrimaryClick,
    connectScroll,
    connectSecondaryClick,
} from 'src/lib/shared/eventHandlers';

const { show_total, rightClick, middleClick, scrollUp, scrollDown, hideCountWhenZero } = options.bar.notifications;
const { ignore } = options.notifications;

const notifs = AstalNotifd.get_default();

export const Notifications = (): BarBoxChild => {
    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style.bind(), show_total.bind()],
        (style: string, showTotal: boolean) => {
            const styleMap: Record<string, string> = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `notifications-container ${styleMap[style]} ${!showTotal ? 'no-label' : ''}`;
        },
    );

    const boxChildren = Variable.derive(
        [
            bind(notifs, 'notifications'),
            bind(notifs, 'dontDisturb'),
            bind(show_total),
            bind(ignore),
            bind(hideCountWhenZero),
        ],
        (
            notif: AstalNotifd.Notification[],
            dnd: boolean,
            showTotal: boolean,
            ignoredNotifs: string[],
            hideCountForZero: boolean,
        ) => {
            const filteredNotifications = filterNotifications(notif, ignoredNotifs);

            const notifIcon = (
                <label
                    halign={Gtk.Align.CENTER}
                    className={'bar-button-icon notifications txt-icon bar'}
                    label={dnd ? '󰂛' : filteredNotifications.length > 0 ? '󱅫' : '󰂚'}
                />
            );

            const notifLabel = (
                <label
                    halign={Gtk.Align.CENTER}
                    className={'bar-button-label notifications'}
                    label={filteredNotifications.length.toString()}
                />
            );

            if (showTotal) {
                if (hideCountForZero && filteredNotifications.length === 0) {
                    return [notifIcon];
                }
                return [notifIcon, notifLabel];
            }
            return [notifIcon];
        },
    );

    const component = (
        <box
            halign={Gtk.Align.START}
            className={componentClassName()}
            child={
                <box halign={Gtk.Align.START} className={'bar-notifications'}>
                    {boxChildren()}
                </box>
            }
        />
    );

    return {
        component,
        isVisible: true,
        boxClass: 'notifications',
        props: {
            setup: (self: GtkWidget): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = connectPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'dashboardmenu');
                    });

                    const disconnectSecondary = connectSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = connectMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    });

                    const disconnectScroll = connectScroll(self, throttledHandler, scrollUp.value, scrollDown.value);

                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};
