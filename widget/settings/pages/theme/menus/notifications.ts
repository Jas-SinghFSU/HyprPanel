import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const NotificationsMenuTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "never",
        class_name: "menu-theme-page notifications paged-container",
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Notifications Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.notifications.label, title: 'Menu Label', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.card, title: 'Card', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.no_notifications_label, title: 'Empty Notifications Backdrop', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.border, title: 'Border', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.switch_divider, title: 'Switch Divider', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.clear, title: 'Clear Notifications Button', type: 'color' }),

                Header('Switch'),
                Option({ opt: options.theme.bar.menus.menu.notifications.switch.enabled, title: 'Enabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.switch.disabled, title: 'Disabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.switch.puck, title: 'Puck', type: 'color' }),


            ]
        })
    })
}
