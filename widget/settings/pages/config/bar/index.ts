import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const BarSettings = () => {
    return Widget.Scrollable({
        vscroll: "always",
        hscroll: "automatic",
        class_name: "menu-theme-page paged-container",
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Layouts'),
                Option({ opt: options.bar.layouts, title: 'Bar Layouts for Monitors', subtitle: 'Please refer to the github README for instructions: https://github.com/Jas-SinghFSU/HyprPanel', type: 'object' }, 'bar-layout-input'),

                Header('Spacing'),
                Option({ opt: options.theme.bar.outer_spacing, title: 'Outer Spacing', subtitle: 'Spacing on the outer left and right edges of the bar.', type: 'string' }),
                Option({ opt: options.theme.bar.buttons.spacing, title: 'Button Spacing', subtitle: 'Spacing between the buttons in the bar.', type: 'string' }),
                Option({ opt: options.theme.bar.buttons.radius, title: 'Button Radius', type: 'string' }),
                Option({ opt: options.theme.bar.floating, title: 'Floating Bar', type: 'boolean' }),
                Option({ opt: options.theme.bar.margin_top, title: 'Margin Top', subtitle: 'Only applies if floating is enabled', type: 'string' }),
                Option({ opt: options.theme.bar.margin_bottom, title: 'Margin Bottom', subtitle: 'Only applies if floating is enabled', type: 'string' }),
                Option({ opt: options.theme.bar.margin_sides, title: 'Margin Sides', subtitle: 'Only applies if floating is enabled', type: 'string' }),
                Option({ opt: options.theme.bar.border_radius, title: 'Border Radius', subtitle: 'Only applies if floating is enabled', type: 'string' }),

                Header('Dashboard'),
                Option({ opt: options.bar.launcher.icon, title: 'Dashboard Menu Icon', type: 'string' }),

                Header('Workspaces'),
                Option({ opt: options.bar.workspaces.show_icons, title: 'Show Workspace Icons', type: 'boolean' }),
                Option({ opt: options.bar.workspaces.icons.available, title: 'Workspace Available', type: 'string' }),
                Option({ opt: options.bar.workspaces.icons.active, title: 'Workspace Active', type: 'string' }),
                Option({ opt: options.bar.workspaces.icons.occupied, title: 'Workspace Occupied', type: 'string' }),
                Option({ opt: options.bar.workspaces.show_numbered, title: 'Show Workspace Numbers', type: 'boolean' }),
                Option({ opt: options.bar.workspaces.numbered_active_indicator, title: 'Numbered Workspace Identifier', subtitle: 'Only applicable if Workspace Numbers are enabled', type: 'enum', enums: ["underline", "highlight"] }),
                Option({ opt: options.theme.bar.buttons.workspaces.numbered_active_highlight_border, title: 'Highlight Radius', subtitle: 'Only applicable if Workspace Numbers are enabled', type: 'string' }),
                Option({ opt: options.theme.bar.buttons.workspaces.numbered_active_highlight_padding, title: 'Highlight Padding', subtitle: 'Only applicable if Workspace Numbers are enabled', type: 'string' }),
                Option({ opt: options.bar.workspaces.spacing, title: 'Spacing', subtitle: 'Spacing between workspace icons', type: 'float' }),
                Option({ opt: options.bar.workspaces.workspaces, title: 'Total Workspaces', type: 'number' }),
                Option({ opt: options.bar.workspaces.monitorSpecific, title: 'Monitor Specific', subtitle: 'Only workspaces applicable to the monitor will be displayed', type: 'boolean' }),
                Option({ opt: options.bar.workspaces.reverse_scroll, title: 'Invert Scroll', subtitle: 'Scrolling up will go to the previous workspace rather than the next.', type: 'boolean' }),
                Option({ opt: options.bar.workspaces.scroll_speed, title: 'Scrolling Speed', type: 'number' }),

                Header('Window Titles'),
                Option({ opt: options.theme.bar.buttons.windowtitle.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),

                Header('Volume'),
                Option({ opt: options.bar.volume.label, title: 'Show Volume Percentage', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.volume.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),

                Header('Network'),
                Option({ opt: options.bar.network.label, title: 'Show Network Name', type: 'boolean' }),
                Option({ opt: options.bar.network.truncation, title: 'Truncate Network Name', subtitle: 'Will truncate the network name to the specified size below.', type: 'boolean' }),
                Option({ opt: options.bar.network.truncation_size, title: 'Truncation Size', type: 'number' }),
                Option({ opt: options.theme.bar.buttons.network.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),

                Header('Bluetooth'),
                Option({ opt: options.bar.bluetooth.label, title: 'Show Bluetooth Label', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.bluetooth.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),

                Header('Battery'),
                Option({ opt: options.bar.battery.label, title: 'Show Battery Percentage', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.battery.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),

                // Header('System Tray'),
                // TODO: Figure out how to handle arrays
                // Option({ opt: options.bar.systray.ignore, title: 'Ignore', subtitle: 'Comma separated string of apps to ignore in the tray', type: 'string' }),

                Header('Clock'),
                Option({ opt: options.bar.clock.format, title: 'Clock Format', type: 'string' }),

                Header('Media'),
                Option({ opt: options.theme.bar.buttons.media.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),
                Option({ opt: options.bar.media.show_artist, title: 'Show Track Artist', type: 'boolean' }),
                Option({ opt: options.bar.media.show_label, title: 'Toggle Media Label', type: 'boolean' }),
                Option({ opt: options.bar.media.truncation, title: 'Truncate Media Label', subtitle: 'Only applicable if Toggle Media Label is enabled', type: 'boolean' }),
                Option({ opt: options.bar.media.truncation_size, title: 'Truncation Size', subtitle: 'Only applicable if Toggle Media Label is enabled', type: 'number', min: 10 }),

                Header('Notifications'),
                Option({ opt: options.bar.notifications.show_total, title: 'Show Total # of notifications', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.notifications.spacing, title: 'Inner Spacing', subtitle: 'Spacing between the icon and the label inside the buttons.', type: 'string' }),
            ]
        })
    })
}
