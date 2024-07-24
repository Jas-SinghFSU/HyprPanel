import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const BarTheme = () => {
    return Widget.Scrollable({
        vscroll: "always",
        hscroll: "never",
        class_name: "bar-theme-page paged-container",
        child: Widget.Box({
            vertical: true,
            children: [
                Header('General'),
                Option({ opt: options.theme.bar.transparent, title: 'Transparent', type: 'boolean' }),
                Option({ opt: options.theme.bar.background, title: 'Background Color', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.monochrome, title: 'Use Global Colors', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.spacing, title: 'Button Spacing', type: 'string' }),
                Option({ opt: options.theme.bar.buttons.radius, title: 'Button Radius', type: 'string' }),
                Option({ opt: options.theme.bar.buttons.background, title: 'Button Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.hover, title: 'Button Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.text, title: 'Button Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.icon, title: 'Button Icon', type: 'color' }),

                Header('Dashboard Button'),
                Option({ opt: options.theme.bar.buttons.dashboard.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.dashboard.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.dashboard.icon, title: 'Icon', type: 'color' }),

                Header('Workspaces'),
                Option({ opt: options.theme.bar.buttons.workspaces.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.workspaces.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.workspaces.available, title: 'Workspace Available Color', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.workspaces.occupied, title: 'Workspace Occupied Color', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.workspaces.active, title: 'Workspace Active Color', type: 'color' }),

                Header('Window Title'),
                Option({ opt: options.theme.bar.buttons.windowtitle.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.windowtitle.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.windowtitle.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.windowtitle.icon, title: 'Icon', type: 'color' }),

                Header('Media'),
                Option({ opt: options.theme.bar.buttons.media.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.media.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.media.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.media.icon, title: 'Icon', type: 'color' }),

                Header('Volume'),
                Option({ opt: options.theme.bar.buttons.volume.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.volume.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.volume.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.volume.icon, title: 'Icon', type: 'color' }),

                Header('Network'),
                Option({ opt: options.theme.bar.buttons.network.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.network.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.network.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.network.icon, title: 'Icon', type: 'color' }),

                Header('Bluetooth'),
                Option({ opt: options.theme.bar.buttons.bluetooth.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.bluetooth.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.bluetooth.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.bluetooth.icon, title: 'Icon', type: 'color' }),

                Header('System Tray'),
                Option({ opt: options.theme.bar.buttons.systray.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.systray.hover, title: 'Hover', type: 'color' }),

                Header('Battery'),
                Option({ opt: options.theme.bar.buttons.battery.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.battery.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.battery.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.battery.icon, title: 'Icon', type: 'color' }),

                Header('Clock'),
                Option({ opt: options.theme.bar.buttons.clock.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.clock.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.clock.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.clock.icon, title: 'Icon', type: 'color' }),

                Header('Notifications'),
                Option({ opt: options.theme.bar.buttons.notifications.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.notifications.hover, title: 'Hover', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.notifications.total, title: 'Notification Count', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.notifications.icon, title: 'Icon', type: 'color' }),
            ]
        })
    })
}
