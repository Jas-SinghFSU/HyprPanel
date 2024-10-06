import { Notification } from 'types/service/notifications.js';
import DropdownMenu from '../shared/dropdown/index.js';
const notifs = await Service.import('notifications');
import { Controls } from './controls/index.js';
import { NotificationCard } from './notification/index.js';
import { NotificationPager } from './pager/index.js';

import options from 'options';
import Window from 'types/widgets/window.js';
import { Attribute, Child } from 'lib/types/widget.js';

const { displayedTotal } = options.notifications;

export default (): Window<Child, Attribute> => {
    const curPage = Variable(1);

    Utils.merge(
        [curPage.bind('value'), displayedTotal.bind('value'), notifs.bind('notifications')],
        (currentPage: number, dispTotal: number, notifications: Notification[]) => {
            // If the page doesn't have enough notifications to display, go back
            // to the previous page.
            if (notifications.length <= (currentPage - 1) * dispTotal) {
                curPage.value = currentPage <= 1 ? 1 : currentPage - 1;
            }
        },
    );

    return DropdownMenu({
        name: 'notificationsmenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'notification-menu-content',
            css: 'padding: 1px; margin: -1px;',
            hexpand: true,
            vexpand: false,
            children: [
                Widget.Box({
                    class_name: 'notification-card-container menu',
                    vertical: true,
                    hexpand: false,
                    vexpand: false,
                    children: [Controls(notifs), NotificationCard(notifs, curPage), NotificationPager(curPage)],
                }),
            ],
        }),
    });
};
