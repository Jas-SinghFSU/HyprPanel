import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const BarGeneral = () => {
    return Widget.Scrollable({
        class_name: "bar-theme-page paged-container",
        vscroll: "automatic",
        child: Widget.Box({
            vertical: true,
            children: [
                Header('General Settings'),
                Option({ opt: options.theme.font.name, title: 'Font', type: 'font' }),
                Option({ opt: options.theme.font.size, title: 'Font Size', type: 'string' }),
                Option({ opt: options.theme.font.weight, title: 'Font Weight', subtitle: "100, 200, 300, etc.", type: 'number', increment: 100, min: 100, max: 900 }),
                Option({
                    opt: options.dummy,
                    title: 'Config',
                    subtitle: 'WARNING: Importing a configuration will replace your current configuration settings.',
                    type: 'config_import',
                    exportData: {
                        filePath: OPTIONS,
                        themeOnly: false
                    }
                }),
                Option({ opt: options.terminal, title: 'Terminal', subtitle: "Tools such as 'btop' will open in this terminal", type: 'string' }),

                Header('Scaling'),
                Option({ opt: options.theme.bar.scaling, title: 'Bar', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.notification.scaling, title: 'Notifications', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.osd.scaling, title: 'OSD', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.dashboard.scaling, title: 'Dashboard Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.dashboard.confirmation_scaling, title: 'Confirmation Dialog', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.media.scaling, title: 'Media Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.volume.scaling, title: 'Volume Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.network.scaling, title: 'Network Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.scaling, title: 'Bluetooth Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.battery.scaling, title: 'Battery Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.clock.scaling, title: 'Clock Menu', type: 'number', min: 1, max: 100, increment: 5 }),
                Option({ opt: options.theme.bar.menus.menu.notifications.scaling, title: 'Notifications Menu', type: 'number', min: 1, max: 100, increment: 5 }),
            ]
        })
    })
}
