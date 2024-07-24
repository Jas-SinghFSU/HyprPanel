import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const BarSettings = () => {
    return Widget.Scrollable({
        vscroll: "always",
        hscroll: "never",
        class_name: "menu-theme-page paged-container",
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Layouts'),
                Option({ opt: options.bar.layouts, title: 'Bar Layouts for Monitors', subtitle: 'Please refer to the github README for instructions: https://github.com/Jas-SinghFSU/HyprPanel', type: 'object' }, 'bar-layout-input'),

                Header('Dashboard'),
                Option({ opt: options.bar.launcher.icon, title: 'Dashboard Menu Icon', type: 'string' }),

                Header('Workspaces'),
                Option({ opt: options.bar.workspaces.show_icons, title: 'Show Workspace Icons', type: 'boolean' }),
                Option({ opt: options.bar.workspaces.icons.available, title: 'Workspace Available', type: 'string' }),
                Option({ opt: options.bar.workspaces.icons.active, title: 'Workspace Active', type: 'string' }),
                Option({ opt: options.bar.workspaces.icons.occupied, title: 'Workspace Occupied', type: 'string' }),
                Option({ opt: options.bar.workspaces.workspaces, title: 'Total Workspaces', type: 'number' }),
                Option({ opt: options.bar.workspaces.monitorSpecific, title: 'Monitor Specific', subtitle: 'Only workspaces applicable to the monitor will be displayed', type: 'boolean' }),

                Header('Volume'),
                Option({ opt: options.bar.volume.label, title: 'Show Volume Percentage', type: 'boolean' }),

                Header('Network'),
                Option({ opt: options.bar.network.label, title: 'Show Network Name', type: 'boolean' }),

                Header('Bluetooth'),
                Option({ opt: options.bar.bluetooth.label, title: 'Show Bluetooth Label', type: 'boolean' }),

                Header('Battery'),
                Option({ opt: options.bar.battery.label, title: 'Show Battery Percentage', type: 'boolean' }),

                Header('System Tray'),
                // TODO: Figure out how to hand arrays
                // Option({ opt: options.bar.systray.ignore, title: 'Ignore', subtitle: 'Comma separated string of apps to ignore in the tray', type: 'string' }),

                Header('Clock'),
                Option({ opt: options.bar.clock.format, title: 'Clock Format', type: 'string' }),

                Header('Notifications'),
                Option({ opt: options.bar.notifications.show_total, title: 'Show Total # of notifications', type: 'boolean' }),
            ]
        })
    })
}
