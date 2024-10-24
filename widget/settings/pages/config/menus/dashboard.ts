import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const DashboardMenuSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        class_name: 'bar-theme-page paged-container',
        vscroll: 'always',
        hscroll: 'automatic',
        vexpand: true,
        overlayScrolling: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Power Menu'),
                Option({
                    opt: options.menus.dashboard.powermenu.avatar.image,
                    title: 'Profile Image',
                    type: 'img',
                    subtitle: "By default, uses '~/.face.icon'",
                }),
                Option({
                    opt: options.menus.dashboard.powermenu.avatar.name,
                    title: 'Profile Name',
                    subtitle: "Use 'system' to automatically set system name",
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.dashboard.profile.size,
                    title: 'Profile Image Size',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.dashboard.profile.radius,
                    title: 'Profile Image Radius',
                    type: 'string',
                }),

                Option({
                    opt: options.menus.dashboard.powermenu.confirmation,
                    title: 'Show Confirmation Dialogue',
                    type: 'boolean',
                }),
                Option({ opt: options.menus.dashboard.powermenu.shutdown, title: 'Shutdown Command', type: 'string' }),
                Option({ opt: options.menus.dashboard.powermenu.reboot, title: 'Reboot Command', type: 'string' }),
                Option({ opt: options.menus.dashboard.powermenu.logout, title: 'Logout Command', type: 'string' }),
                Option({ opt: options.menus.dashboard.powermenu.sleep, title: 'Sleep Command', type: 'string' }),

                Header('Controls'),
                Option({ opt: options.menus.dashboard.controls.enabled, title: 'Enabled', type: 'boolean' }),

                Header('Resource Usage Metrics'),
                Option({ opt: options.menus.dashboard.stats.enabled, title: 'Enabled', type: 'boolean' }),
                Option({
                    opt: options.menus.dashboard.stats.enable_gpu,
                    title: 'Track GPU',
                    subtitle: "NOTE: This is currently only available for NVidia GPUs and requires 'python-gpustat'.",
                    type: 'boolean',
                }),
                Option({
                    opt: options.menus.dashboard.stats.interval,
                    title: 'Update Interval',
                    subtitle: 'The frequency at which to poll system metrics.',
                    type: 'number',
                    min: 100,
                    increment: 500,
                }),

                Header('Shortcuts'),
                Option({ opt: options.menus.dashboard.shortcuts.enabled, title: 'Enabled', type: 'boolean' }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut1.icon,
                    title: 'Left - Shortcut 1 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut1.command,
                    title: 'Left - Shortcut 1 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut1.tooltip,
                    title: 'Left - Shortcut 1 (Tooltip)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut2.icon,
                    title: 'Left - Shortcut 2 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut2.command,
                    title: 'Left - Shortcut 2 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut2.tooltip,
                    title: 'Left - Shortcut 2 (Tooltip)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut3.icon,
                    title: 'Left - Shortcut 3 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut3.command,
                    title: 'Left - Shortcut 3 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut3.tooltip,
                    title: 'Left - Shortcut 3 (Tooltip)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut4.icon,
                    title: 'Left - Shortcut 4 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut4.command,
                    title: 'Left - Shortcut 4 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.left.shortcut4.tooltip,
                    title: 'Left - Shortcut 4 (Tooltip)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut1.icon,
                    title: 'Right - Shortcut 1 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut1.command,
                    title: 'Right - Shortcut 1 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut1.tooltip,
                    title: 'Right - Shortcut 1 (Tooltip)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut3.icon,
                    title: 'Right - Shortcut 3 (Icon)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut3.command,
                    title: 'Right - Shortcut 3 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.shortcuts.right.shortcut3.tooltip,
                    title: 'Right - Shortcut 3 (Tooltip)',
                    type: 'string',
                }),

                Header('Directories'),
                Option({ opt: options.menus.dashboard.directories.enabled, title: 'Enabled', type: 'boolean' }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory1.label,
                    title: 'Left - Directory 1 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory1.command,
                    title: 'Left - Directory 1 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory2.label,
                    title: 'Left - Directory 2 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory2.command,
                    title: 'Left - Directory 2 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory3.label,
                    title: 'Left - Directory 3 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.left.directory3.command,
                    title: 'Left - Directory 3 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory1.label,
                    title: 'Right - Directory 1 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory1.command,
                    title: 'Right - Directory 1 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory2.label,
                    title: 'Right - Directory 2 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory2.command,
                    title: 'Right - Directory 2 (Command)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory3.label,
                    title: 'Right - Directory 3 (Label)',
                    type: 'string',
                }),
                Option({
                    opt: options.menus.dashboard.directories.right.directory3.command,
                    title: 'Right - Directory 3 (Command)',
                    type: 'string',
                }),
            ],
        }),
    });
};
