import DropdownMenu from "../DropdownMenu.js";
const notifs = await Service.import("notifications");
import { Controls } from "./controls/index.js";
import { NotificationCard } from "./notification/index.js";
import { NotificationPager } from "./pager/index.js";

import options from "options";

const { displayedTotal } = options.notifications;
const { show: showPager } = options.theme.bar.menus.menu.notifications.pager;

export default () => {
    const curPage = Variable(1);

    Utils.merge([curPage.bind("value"), displayedTotal.bind("value"), notifs.bind("notifications")], (currentPage, dispTotal, notifications) => {
        // If the page doesn't have enough notifications to display, go back
        // to the previous page.
        if (notifications.length <= (currentPage - 1) * dispTotal) {
            curPage.value = currentPage <= 1 ? 1 : currentPage - 1;
        }
    });

    return DropdownMenu({
        name: "notificationsmenu",
        transition: "crossfade",
        child: Widget.Box({
            class_name: "notification-menu-content",
            css: "padding: 1px; margin: -1px;",
            hexpand: true,
            vexpand: false,
            children: [
                Widget.Box({
                    class_name: "notification-card-container menu",
                    vertical: true,
                    hexpand: false,
                    vexpand: false,
                    children: showPager.bind("value").as(shPgr => {
                        if (shPgr) {
                            return [Controls(notifs), NotificationCard(notifs, curPage), NotificationPager(curPage)];
                        }
                        return [Controls(notifs), NotificationCard(notifs, curPage)]

                    })
                }),
            ],
        }),
    });
};
