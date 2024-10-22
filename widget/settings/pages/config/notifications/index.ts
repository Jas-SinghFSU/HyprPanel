import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const NotificationSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('Notification Settings'),
                Option({
                    opt: options.notifications.ignore,
                    title: 'Ignored Applications',
                    subtitle:
                        'Applications to ignore.\n' +
                        'Wiki: https://hyprpanel.com/configuration/notifications.html#ignored-applications',
                    subtitleLink: 'https://hyprpanel.com/configuration/notifications.html#ignored-applications',
                    type: 'object',
                }),
                Option({
                    opt: options.notifications.position,
                    title: 'Notification Location',
                    type: 'enum',
                    enums: ['top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left'],
                }),
                Option({
                    opt: options.theme.notification.border_radius,
                    title: 'Border Radius',
                    type: 'string',
                }),
                Option({
                    opt: options.notifications.monitor,
                    title: 'Monitor',
                    subtitle: 'The ID of the monitor on which to display the notification',
                    type: 'number',
                }),
                Option({
                    opt: options.notifications.active_monitor,
                    title: 'Follow Cursor',
                    subtitle: 'The notification will follow the monitor of your cursor',
                    type: 'boolean',
                }),
                Option({
                    opt: options.notifications.clearDelay,
                    title: 'Clear Delay',
                    subtitle:
                        'The delay in milliseconds before a notification is cleared' +
                        '\nWARNING: Setting this value too low may crash AGS depending on your system.',
                    type: 'number',
                    increment: 20,
                }),
                Option({
                    opt: options.notifications.timeout,
                    title: 'Notification Timeout',
                    subtitle: 'How long notification popups will last (in milliseconds).',
                    type: 'number',
                }),
                Option({
                    opt: options.notifications.cache_actions,
                    title: 'Preserve Actions',
                    subtitle: 'This will persist the action buttons of a notification after rebooting.',
                    type: 'boolean',
                }),

                Header('Notification Menu Settings'),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.height,
                    title: 'Notification Menu Height',
                    type: 'string',
                }),
                Option({
                    opt: options.notifications.displayedTotal,
                    title: 'Displayed Total',
                    subtitle:
                        'How many notifications to show in the menu at once.\n' +
                        'Newer notifications will display towards the top.',
                    type: 'number',
                    min: 1,
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.pager.show,
                    title: 'Show Pager',
                    subtitle: 'Shows the pagination footer at the bottom of the menu.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.scrollbar.width,
                    title: 'Scrollbar Width',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.notifications.scrollbar.radius,
                    title: 'Scrollbar Radius',
                    type: 'string',
                }),
            ],
        }),
    });
};
