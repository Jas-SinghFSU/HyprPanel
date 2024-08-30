const notifs = await Service.import("notifications");

import options from "options";
import { Variable } from "types/variable";

const { displayedTotal } = options.notifications;

export const NotificationPager = (curPage: Variable<number>) => {
    return Widget.Box({
        class_name: "notification-menu-pager",
        hexpand: true,
        vexpand: false,
        children: Utils.merge([curPage.bind("value"), displayedTotal.bind("value"), notifs.bind("notifications")], (currentPage, dispTotal, notifications) => {
            return [
                Widget.Button({
                    hexpand: true,
                    hpack: "start",
                    class_name: `pager-button left ${currentPage <= 1 ? "disabled" : ""}`,
                    onPrimaryClick: () => {
                        curPage.value = 1;
                    },
                    child: Widget.Label({
                        className: "pager-button-label",
                        label: ""
                    }),
                }),
                Widget.Button({
                    hexpand: true,
                    hpack: "start",
                    class_name: `pager-button left ${currentPage <= 1 ? "disabled" : ""}`,
                    onPrimaryClick: () => {
                        curPage.value = currentPage <= 1 ? 1 : currentPage - 1;
                    },
                    child: Widget.Label({
                        className: "pager-button-label",
                        label: ""
                    }),
                }),
                Widget.Label({
                    hexpand: true,
                    hpack: "center",
                    class_name: "pager-label",
                    label: `${currentPage} / ${Math.ceil(notifs.notifications.length / dispTotal) || 1}`
                }),
                Widget.Button({
                    hexpand: true,
                    hpack: "end",
                    class_name: `pager-button right ${currentPage >= Math.ceil(notifs.notifications.length / dispTotal) ? "disabled" : ""}`,
                    onPrimaryClick: () => {
                        const maxPage = Math.ceil(notifs.notifications.length / displayedTotal.value);
                        curPage.value = currentPage >= maxPage ? currentPage : currentPage + 1;
                    },
                    child: Widget.Label({
                        className: "pager-button-label",
                        label: ""
                    }),
                }),
                Widget.Button({
                    hexpand: true,
                    hpack: "end",
                    class_name: `pager-button right ${currentPage >= Math.ceil(notifs.notifications.length / dispTotal) ? "disabled" : ""}`,
                    onPrimaryClick: () => {
                        const maxPage = Math.ceil(notifs.notifications.length / displayedTotal.value);
                        curPage.value = maxPage;
                    },
                    child: Widget.Label({
                        className: "pager-button-label",
                        label: "󰄾"
                    }),
                }),
            ]
        })
    })
}
