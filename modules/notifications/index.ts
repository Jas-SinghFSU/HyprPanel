const notifs = await Service.import('notifications');
import options from 'options';
import { notifHasImg } from '../menus/notifications/utils.js';
import { Image } from './image/index.js';
import { Action } from './actions/index.js';
import { Header } from './header/index.js';
import { Body } from './body/index.js';
import { CloseButton } from './close/index.js';
import { getPosition } from 'lib/utils.js';
import { filterNotifications } from 'lib/shared/notifications.js';
import { Notification } from 'types/service/notifications.js';
import Window from 'types/widgets/window.js';
import Box from 'types/widgets/box.js';
import { Attribute, Child } from 'lib/types/widget.js';
const hyprland = await Service.import('hyprland');

const { position, timeout, cache_actions, monitor, active_monitor, displayedTotal, ignore } = options.notifications;

const curMonitor = Variable(monitor.value);

hyprland.active.connect('changed', () => {
    curMonitor.value = hyprland.active.monitor.id;
});

export default (): Window<Box<Child, Attribute>, unknown> => {
    Utils.merge([timeout.bind('value'), cache_actions.bind('value')], (timeout, doCaching) => {
        notifs.popupTimeout = timeout;
        notifs.cacheActions = doCaching;
    });

    return Widget.Window({
        name: 'notifications-window',
        class_name: 'notifications-window',
        monitor: Utils.merge(
            [curMonitor.bind('value'), monitor.bind('value'), active_monitor.bind('value')],
            (curMon, mon, activeMonitor) => {
                if (activeMonitor === true) {
                    return curMon;
                }

                return mon;
            },
        ),
        layer: options.tear.bind('value').as((tear) => (tear ? 'top' : 'overlay')),
        anchor: position.bind('value').as((v) => getPosition(v)),
        exclusivity: 'normal',
        child: Widget.Box({
            class_name: 'notification-card-container',
            vertical: true,
            hexpand: true,
            setup: (self) => {
                Utils.merge(
                    [notifs.bind('popups'), ignore.bind('value')],
                    (notifications: Notification[], ignoredNotifs: string[]) => {
                        const filteredNotifications = filterNotifications(notifications, ignoredNotifs);

                        return (self.children = filteredNotifications.slice(0, displayedTotal.value).map((notif) => {
                            return Widget.Box({
                                class_name: 'notification-card',
                                vpack: 'start',
                                hexpand: true,
                                children: [
                                    Image(notif),
                                    Widget.Box({
                                        vpack: 'start',
                                        vertical: true,
                                        hexpand: true,
                                        class_name: `notification-card-content ${!notifHasImg(notif) ? 'noimg' : ''}`,
                                        children: [Header(notif), Body(notif), Action(notif, notifs)],
                                    }),
                                    CloseButton(notif, notifs),
                                ],
                            });
                        }));
                    },
                );
            },
        }),
    });
};
