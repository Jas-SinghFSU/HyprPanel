import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';

export const BarSettings = (): Scrollable<Gtk.Widget, Gtk.Widget> => {
    return Widget.Scrollable({
        vscroll: 'always',
        hscroll: 'automatic',
        class_name: 'menu-theme-page paged-container',
        child: Widget.Box({
            vertical: true,
            children: [
                /*
                 ******************************
                 *           LAYOUTS          *
                 ******************************
                 */
                Header('Layouts'),
                Option(
                    {
                        opt: options.bar.layouts,
                        title: 'Bar Layouts for Monitors',
                        subtitle: 'Wiki Link: https://hyprpanel.com/configuration/panel.html#layouts',
                        type: 'object',
                        subtitleLink: 'https://hyprpanel.com/configuration/panel.html#layouts',
                    },
                    'bar-layout-input',
                ),
                Option({
                    opt: options.theme.bar.floating,
                    title: 'Floating Bar',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.location,
                    title: 'Location',
                    type: 'enum',
                    enums: ['top', 'bottom'],
                }),
                Option({
                    opt: options.theme.bar.buttons.enableBorders,
                    title: 'Enable Button Borders',
                    subtitle: 'Enables button borders for all buttons in the bar.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.borderSize,
                    title: 'Button Border Size',
                    subtitle: 'Button border for the individual modules must be enabled first',
                    type: 'string',
                }),
                /*
                 ******************************
                 *          SPACING           *
                 ******************************
                 */
                Header('Spacing'),
                Option({
                    opt: options.theme.bar.outer_spacing,
                    title: 'Outer Spacing',
                    subtitle: 'Spacing on the outer left and right edges of the bar.',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.y_margins,
                    title: 'Vertical Margins',
                    subtitle: 'Spacing above/below the buttons in the bar.',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.spacing,
                    title: 'Button Spacing',
                    subtitle: 'Spacing between the buttons in the bar.',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.padding_x,
                    title: 'Button Horizontal Padding',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.padding_y,
                    title: 'Button Vertical Padding',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.radius,
                    title: 'Button Radius',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.layer,
                    title: 'Layer',
                    type: 'enum',
                    subtitle: 'Layer determines the Z index of your bar.',
                    enums: ['top', 'bottom', 'overlay', 'background'],
                }),
                Option({
                    opt: options.theme.bar.dropdownGap,
                    title: 'Dropdown Gap',
                    subtitle: 'The gap between the dropdown and the bar',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.margin_top,
                    title: 'Margin Top',
                    subtitle: 'Only applies if floating is enabled',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.margin_bottom,
                    title: 'Margin Bottom',
                    subtitle: 'Only applies if floating is enabled',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.margin_sides,
                    title: 'Margin Sides',
                    subtitle: 'Only applies if floating is enabled',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.border_radius,
                    title: 'Border Radius',
                    subtitle: 'Only applies if floating is enabled',
                    type: 'string',
                }),

                /*
                 ******************************
                 *          Actions           *
                 ******************************
                 */

                Header('Actions'),
                Option({
                    opt: options.bar.scrollSpeed,
                    title: 'Scrolling Speed',
                    subtitle: 'The speed at which the commands assigned to the scroll event will trigger',
                    type: 'number',
                }),
                /*
                 ******************************
                 *         DASHBOARD          *
                 ******************************
                 */
                Header('Dashboard'),
                Option({
                    opt: options.bar.launcher.icon,
                    title: 'Dashboard Menu Icon',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.dashboard.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.launcher.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.launcher.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.launcher.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.launcher.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *         WORKSPACES         *
                 ******************************
                 */
                Header('Workspaces'),
                Option({
                    opt: options.theme.bar.buttons.workspaces.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.showAllActive,
                    title: 'Mark Active Workspace On All Monitors',
                    subtitle: 'Marks the currently active workspace on each monitor.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.workspaces.fontSize,
                    title: 'Indicator Size',
                    subtitle:
                        'Only applicable to numbered workspaces and mapped icons\n' +
                        'Adjust with caution as it may cause the bar to expand',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.workspaces.show_icons,
                    title: 'Show Workspace Icons',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.icons.available,
                    title: 'Workspace Available',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.workspaces.icons.active,
                    title: 'Workspace Active',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.workspaces.icons.occupied,
                    title: 'Workspace Occupied',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.workspaces.show_numbered,
                    title: 'Show Workspace Numbers',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.numbered_active_indicator,
                    title: 'Numbered Workspace Identifier',
                    subtitle: 'Only applicable if Workspace Numbers are enabled',
                    type: 'enum',
                    enums: ['underline', 'highlight', 'color'],
                }),
                Option({
                    opt: options.theme.bar.buttons.workspaces.smartHighlight,
                    title: 'Smart Highlight',
                    subtitle:
                        'Automatically determines the highlight color of the workspace icon.\n' +
                        'Only compatible with mapped icons.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.workspaces.numbered_active_highlight_border,
                    title: 'Highlight Radius',
                    subtitle: 'Only applicable if Workspace Numbers are enabled',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.buttons.workspaces.numbered_active_highlight_padding,
                    title: 'Highlight Padding',
                    subtitle: 'Only applicable if Workspace Numbers are enabled',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.workspaces.showWsIcons,
                    title: 'Map Workspaces to Icons',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.workspaceIconMap,
                    title: 'Workspace Icon Mappings',
                    type: 'object',
                }),
                Option({
                    opt: options.bar.workspaces.spacing,
                    title: 'Spacing',
                    subtitle: 'Spacing between workspace icons',
                    type: 'float',
                }),
                Option({
                    opt: options.bar.workspaces.workspaces,
                    title: 'Total Workspaces',
                    subtitle: 'The least amount of workspaces to always show.',
                    type: 'number',
                }),
                Option({
                    opt: options.bar.workspaces.monitorSpecific,
                    title: 'Monitor Specific',
                    subtitle:
                        'Only workspaces applicable to the monitor will be displayed.\n' +
                        "Works in conjunction with 'Total Workspaces'.",
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.hideUnoccupied,
                    title: 'Hide Unoccupied',
                    subtitle: 'Only show workspaces that are occupied or active',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.workspaceMask,
                    title: 'Mask Workspace Numbers On Monitors',
                    subtitle:
                        'Only applicable if Workspace Numbers and Monitor Specific are enabled.\n' +
                        "Forces each Monitor's Workspace labels to start from 1.",
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.reverse_scroll,
                    title: 'Invert Scroll',
                    subtitle: 'Scrolling up will go to the previous workspace rather than the next.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.workspaces.scroll_speed,
                    title: 'Scrolling Speed',
                    type: 'number',
                }),
                Option({
                    opt: options.bar.workspaces.ignored,
                    title: 'Ignored Workspaces',
                    subtitle: 'A regex that defines workspaces to ignore',
                    type: 'string',
                }),

                /*
                 ******************************
                 *       WINDOW TITLES        *
                 ******************************
                 */
                Header('Window Titles'),
                Option({
                    opt: options.theme.bar.buttons.windowtitle.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.custom_title,
                    title: 'Use Custom Title',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.title_map,
                    title: 'Window Title Mappings',
                    subtitle:
                        'Only applicable if Show Custom Title is enabled\nWiki Link: https://hyprpanel.com/configuration/panel.html#window-title-mappings',
                    type: 'object',
                    subtitleLink: 'https://hyprpanel.com/configuration/panel.html#window-title-mappings',
                }),
                Option({
                    opt: options.bar.windowtitle.class_name,
                    title: 'Use Class Name',
                    subtitle:
                        "Only applicable if Show Custom Title is disabled\nDisplays the window's class name instead of its title.",
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.label,
                    title: 'Show Window Title Label',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.icon,
                    title: 'Show Icon',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.truncation,
                    title: 'Truncate Window Title',
                    subtitle: 'Will truncate the window title to the specified size below.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.windowtitle.truncation_size,
                    title: 'Truncation Size',
                    type: 'number',
                    min: 10,
                }),
                Option({
                    opt: options.theme.bar.buttons.windowtitle.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.windowtitle.leftClick,
                    title: 'Left Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.windowtitle.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.windowtitle.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.windowtitle.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.windowtitle.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *          VOLUME            *
                 ******************************
                 */
                Header('Volume'),
                Option({
                    opt: options.theme.bar.buttons.volume.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.volume.label,
                    title: 'Show Volume Percentage',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.volume.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.volume.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.volume.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.volume.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.volume.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *          NETWORK           *
                 ******************************
                 */
                Header('Network'),
                Option({
                    opt: options.theme.bar.buttons.network.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.network.label,
                    title: 'Show Network Name',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.network.truncation,
                    title: 'Truncate Network Name',
                    subtitle: 'Will truncate the network name to the specified size below.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.network.truncation_size,
                    title: 'Truncation Size',
                    type: 'number',
                }),
                Option({
                    opt: options.theme.bar.buttons.network.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.network.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.network.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.network.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.network.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *         BLUETOOTH          *
                 ******************************
                 */
                Header('Bluetooth'),
                Option({
                    opt: options.theme.bar.buttons.bluetooth.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.bluetooth.label,
                    title: 'Show Bluetooth Label',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.bluetooth.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.bluetooth.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.bluetooth.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.bluetooth.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.bluetooth.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *          BATTERY           *
                 ******************************
                 */
                Header('Battery'),
                Option({
                    opt: options.theme.bar.buttons.battery.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.battery.label,
                    title: 'Show Battery Percentage',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.battery.hideLabelWhenFull,
                    title: 'Hide Battery Percentage When Full',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.battery.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.battery.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.battery.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.battery.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.battery.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *        SYSTEM TRAY         *
                 ******************************
                 */
                Header('System Tray'),
                Option({
                    opt: options.theme.bar.buttons.systray.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.systray.ignore,
                    title: 'Ignore List',
                    subtitle:
                        'An array of applications to prevent from showing in the system tray.\n' +
                        'Wiki: https://hyprpanel.com/configuration/panel.html#system-tray',
                    subtitleLink: 'https://hyprpanel.com/configuration/panel.html#system-tray',
                    type: 'object',
                }),

                /*
                 ******************************
                 *           CLOCK            *
                 ******************************
                 */
                Header('Clock'),
                Option({
                    opt: options.theme.bar.buttons.clock.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.clock.format,
                    title: 'Clock Format',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.icon,
                    title: 'Icon',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.showIcon,
                    title: 'Show Icon',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.clock.showTime,
                    title: 'Show Time',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.clock.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.clock.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),

                /*
                 ******************************
                 *          MEDIA             *
                 ******************************
                 */
                Header('Media'),
                Option({
                    opt: options.theme.bar.buttons.media.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.media.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.media.show_artist,
                    title: 'Show Track Artist',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.media.show_label,
                    title: 'Toggle Media Label',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.media.truncation,
                    title: 'Truncate Media Label',
                    subtitle: 'Only applicable if Toggle Media Label is enabled',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.media.truncation_size,
                    title: 'Truncation Size',
                    subtitle: 'Only applicable if Toggle Media Label is enabled',
                    type: 'number',
                    min: 10,
                }),
                Option({
                    opt: options.bar.media.show_active_only,
                    title: 'Auto Hide',
                    subtitle: 'Button will automatically hide if no media is detected.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.media.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.media.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),

                /*
                 ******************************
                 *       NOTIFICATIONS        *
                 ******************************
                 */
                Header('Notifications'),
                Option({
                    opt: options.theme.bar.buttons.notifications.enableBorder,
                    title: 'Button Border',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.notifications.show_total,
                    title: 'Show Total # of notifications',
                    type: 'boolean',
                }),
                Option({
                    opt: options.bar.notifications.hideCountWhenZero,
                    title: 'Auto Hide Label',
                    subtitle: 'Hide Total # of notifications when zero',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.bar.buttons.notifications.spacing,
                    title: 'Inner Spacing',
                    subtitle: 'Spacing between the icon and the label inside the buttons.',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.notifications.rightClick,
                    title: 'Right Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.notifications.middleClick,
                    title: 'Middle Click',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.notifications.scrollUp,
                    title: 'Scroll Up',
                    type: 'string',
                }),
                Option({
                    opt: options.bar.notifications.scrollDown,
                    title: 'Scroll Down',
                    type: 'string',
                }),
            ],
        }),
    });
};
