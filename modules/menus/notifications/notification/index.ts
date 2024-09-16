import { Notifications, Notification } from 'types/service/notifications';
import { notifHasImg } from '../utils.js';
import { Header } from './header/index.js';
import { Actions } from './actions/index.js';
import { Image } from './image/index.js';
import { Placeholder } from './placeholder/index.js';
import { Body } from './body/index.js';
import { CloseButton } from './close/index.js';
import options from 'options.js';
import { Variable } from 'types/variable.js';
import { filterNotifications } from 'lib/shared/notifications.js';
import Scrollable from 'types/widgets/scrollable.js';
import { Attribute, Child } from 'lib/types/widget.js';

const { displayedTotal, ignore } = options.notifications;

const NotificationCard = (notifs: Notifications, curPage: Variable<number>): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'menu-content-container notifications',
            hpack: 'center',
            vexpand: true,
            spacing: 0,
            vertical: true,
            setup: (self) => {
                Utils.merge(
                    [
                        notifs.bind('notifications'),
                        curPage.bind('value'),
                        displayedTotal.bind('value'),
                        ignore.bind('value'),
                    ],
                    (notifications, currentPage, dispTotal, ignoredNotifs) => {
                        const filteredNotifications = filterNotifications(notifications, ignoredNotifs);

                        const sortedNotifications = filteredNotifications.sort((a, b) => b.time - a.time);

                        if (filteredNotifications.length <= 0) {
                            return (self.children = [Placeholder(notifs)]);
                        }

                        const pageStart = (currentPage - 1) * dispTotal;
                        const pageEnd = currentPage * dispTotal;
                        return (self.children = sortedNotifications
                            .slice(pageStart, pageEnd)
                            .map((notif: Notification) => {
                                return Widget.Box({
                                    class_name: 'notification-card-content-container',
                                    children: [
                                        Widget.Box({
                                            class_name: 'notification-card menu',
                                            vpack: 'start',
                                            hexpand: true,
                                            vexpand: false,
                                            children: [
                                                Image(notif),
                                                Widget.Box({
                                                    vpack: 'center',
                                                    vertical: true,
                                                    hexpand: true,
                                                    class_name: `notification-card-content ${!notifHasImg(notif) ? 'noimg' : ' menu'}`,
                                                    children: [Header(notif), Body(notif), Actions(notif, notifs)],
                                                }),
                                            ],
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

export { NotificationCard };
