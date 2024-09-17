import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const NotificationsMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page notifications paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Notifications Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.notifications.label, title: 'Menu Label', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.notifications.card, title: 'Card', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.no_notifications_label,
                    title: 'Empty Notifications Backdrop',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.notifications.border, title: 'Border', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.switch_divider,
                    title: 'Switch Divider',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.clear,
                    title: 'Clear Notifications Button',
                    type: 'color',
                }),

                Header('Switch'),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.switch.enabled,
                    title: 'Enabled',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.switch.disabled,
                    title: 'Disabled',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.notifications.switch.puck, title: 'Puck', type: 'color' }),

                Header('Scrollbar'),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.scrollbar.color,
                    title: 'Scrollbar Color',
                    type: 'color',
                }),

                Header('Pagination'),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.pager.background,
                    title: 'Pager Footer Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.pager.button,
                    title: 'Pager Button Color',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.pager.label,
                    title: 'Pager Label Color',
                    type: 'color',
                }),
            ],
        }),
    });
};
