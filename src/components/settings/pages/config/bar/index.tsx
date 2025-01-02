import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const BarSettings = (): JSX.Element => {
    return (
        <scrollable
            name={'Bar'}
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            className="menu-theme-page paged-container"
        >
            <box vertical>
                {/* Layouts Section */}
                <Header title="Layouts" />
                <Option
                    opt={options.bar.layouts}
                    title="Bar Layouts for Monitors"
                    subtitle="Wiki Link: https://hyprpanel.com/configuration/panel.html#layouts"
                    type="object"
                    subtitleLink="https://hyprpanel.com/configuration/panel.html#layouts"
                    className="bar-layout-input"
                />
                <Option opt={options.theme.bar.floating} title="Floating Bar" type="boolean" />
                <Option opt={options.theme.bar.location} title="Location" type="enum" enums={['top', 'bottom']} />

                <Option
                    opt={options.bar.autoHide}
                    title="Auto Hide"
                    type="enum"
                    enums={['never', 'fullscreen', 'single-window']}
                />
                <Option
                    opt={options.theme.bar.buttons.enableBorders}
                    title="Enable Button Borders"
                    subtitle="Enables button borders for all buttons in the bar."
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.buttons.borderSize}
                    title="Button Border Size"
                    subtitle="Button border for the individual modules must be enabled first"
                    type="string"
                />

                {/* General Section */}
                <Header title="General" />
                <Option
                    opt={options.theme.bar.border.location}
                    title="Bar Border Location"
                    type="enum"
                    enums={['none', 'full', 'top', 'right', 'bottom', 'left', 'horizontal', 'vertical']}
                />
                <Option opt={options.theme.bar.border.width} title="Bar Border Width" type="string" />
                <Option
                    opt={options.theme.bar.border_radius}
                    title="Border Radius"
                    subtitle="Only applies if floating is enabled"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.outer_spacing}
                    title="Outer Spacing"
                    subtitle="Spacing on the outer left and right edges of the bar."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.y_margins}
                    title="Vertical Margins"
                    subtitle="Spacing above/below the buttons in the bar."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.spacing}
                    title="Button Spacing"
                    subtitle="Spacing between the buttons in the bar."
                    type="string"
                />
                <Option opt={options.theme.bar.buttons.padding_x} title="Button Horizontal Padding" type="string" />
                <Option opt={options.theme.bar.buttons.padding_y} title="Button Vertical Padding" type="string" />
                <Option opt={options.theme.bar.buttons.radius} title="Button Radius" type="string" />
                <Option
                    opt={options.theme.bar.buttons.innerRadiusMultiplier}
                    title="Inner Button Radius Multiplier"
                    subtitle="Change this to fine-tune the padding and prevent any overflow or gaps."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.layer}
                    title="Layer"
                    type="enum"
                    subtitle="Layer determines the Z index of your bar."
                    enums={['top', 'bottom', 'overlay', 'background']}
                />
                <Option
                    opt={options.theme.bar.dropdownGap}
                    title="Dropdown Gap"
                    subtitle="The gap between the dropdown and the bar"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.margin_top}
                    title="Margin Top"
                    subtitle="Only applies if floating is enabled"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.margin_bottom}
                    title="Margin Bottom"
                    subtitle="Only applies if floating is enabled"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.margin_sides}
                    title="Margin Sides"
                    subtitle="Only applies if floating is enabled"
                    type="string"
                />

                {/* Actions Section */}
                <Header title="Actions" />
                <Option
                    opt={options.bar.scrollSpeed}
                    title="Scrolling Speed"
                    subtitle="The speed at which the commands assigned to the scroll event will trigger"
                    type="number"
                />

                {/* Dashboard Section */}
                <Header title="Dashboard" />
                <Option opt={options.bar.launcher.icon} title="Dashboard Menu Icon" type="string" />
                <Option opt={options.bar.launcher.autoDetectIcon} title="Auto Detect Icon" type="boolean" />
                <Option opt={options.theme.bar.buttons.dashboard.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.launcher.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.launcher.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.launcher.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.launcher.scrollDown} title="Scroll Down" type="string" />

                {/* Workspaces Section */}
                <Header title="Workspaces" />
                <Option opt={options.theme.bar.buttons.workspaces.enableBorder} title="Button Border" type="boolean" />
                <Option
                    opt={options.bar.workspaces.showAllActive}
                    title="Mark Active Workspace On All Monitors"
                    subtitle="Marks the currently active workspace on each monitor."
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.pill.radius}
                    title="Pill Radius"
                    subtitle="Adjust the radius for the default indicator."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.pill.height}
                    title="Pill Height"
                    subtitle="Adjust the height for the default indicator."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.pill.width}
                    title="Pill Width"
                    subtitle="Adjust the width for the default indicator."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.pill.active_width}
                    title="Active Pill Width"
                    subtitle="Adjust the width for the active default indicator."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.fontSize}
                    title="Indicator Size"
                    subtitle="Only applicable to numbered workspaces and mapped icons. Adjust carefully."
                    type="string"
                />
                <Option opt={options.bar.workspaces.show_icons} title="Show Workspace Icons" type="boolean" />
                <Option opt={options.bar.workspaces.icons.available} title="Workspace Available" type="string" />
                <Option opt={options.bar.workspaces.icons.active} title="Workspace Active" type="string" />
                <Option opt={options.bar.workspaces.icons.occupied} title="Workspace Occupied" type="string" />
                <Option opt={options.bar.workspaces.show_numbered} title="Show Workspace Numbers" type="boolean" />
                <Option
                    opt={options.bar.workspaces.numbered_active_indicator}
                    title="Numbered Workspace Identifier"
                    subtitle="Only applicable if Workspace Numbers are enabled"
                    type="enum"
                    enums={['underline', 'highlight', 'color']}
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.smartHighlight}
                    title="Smart Highlight"
                    subtitle="Automatically determines highlight color for mapped icons."
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.numbered_active_highlight_border}
                    title="Highlight Radius"
                    subtitle="Only applicable if Workspace Numbers are enabled"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.numbered_active_highlight_padding}
                    title="Highlight Padding"
                    subtitle="Only applicable if Workspace Numbers are enabled"
                    type="string"
                />
                <Option
                    opt={options.bar.workspaces.showWsIcons}
                    title="Map Workspaces to Icons"
                    subtitle="https://hyprpanel.com/configuration/panel.html#show-workspace-icons"
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.showApplicationIcons}
                    title="Map Workspaces to Application Icons"
                    subtitle="Requires 'Map Workspace to Icons' enabled. See docs."
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.applicationIconOncePerWorkspace}
                    title="Hide Duplicate App Icons"
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.applicationIconMap}
                    title="App Icon Mappings"
                    subtitle="Use class/title from 'hyprctl clients'"
                    type="object"
                />
                <Option
                    opt={options.bar.workspaces.applicationIconFallback}
                    title="Fallback App Icon"
                    subtitle="Fallback icon if no specific icon defined"
                    type="string"
                />
                <Option
                    opt={options.bar.workspaces.applicationIconEmptyWorkspace}
                    title="App Icon for empty workspace"
                    type="string"
                />
                <Option
                    opt={options.bar.workspaces.workspaceIconMap}
                    title="Workspace Icon & Color Mappings"
                    subtitle="https://hyprpanel.com/configuration/panel.html#show-workspace-icons"
                    type="object"
                />
                <Option
                    opt={options.bar.workspaces.spacing}
                    title="Spacing"
                    subtitle="Spacing between workspace icons"
                    type="float"
                />
                <Option
                    opt={options.bar.workspaces.workspaces}
                    title="Total Workspaces"
                    subtitle="Minimum number of workspaces to always show."
                    type="number"
                />
                <Option
                    opt={options.bar.workspaces.monitorSpecific}
                    title="Monitor Specific"
                    subtitle="Only workspaces of the monitor are shown."
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.hideUnoccupied}
                    title="Hide Unoccupied"
                    subtitle="Only show occupied or active workspaces"
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.workspaceMask}
                    title="Mask Workspace Numbers On Monitors"
                    subtitle="For monitor-specific numbering"
                    type="boolean"
                />
                <Option
                    opt={options.bar.workspaces.reverse_scroll}
                    title="Invert Scroll"
                    subtitle="Scrolling up goes to previous workspace"
                    type="boolean"
                />
                <Option opt={options.bar.workspaces.scroll_speed} title="Scrolling Speed" type="number" />
                <Option
                    opt={options.bar.workspaces.ignored}
                    title="Ignored Workspaces"
                    subtitle="A regex defining ignored workspaces"
                    type="string"
                />

                {/* Window Titles Section */}
                <Header title="Window Titles" />
                <Option opt={options.theme.bar.buttons.windowtitle.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.windowtitle.custom_title} title="Use Custom Title" type="boolean" />
                <Option
                    opt={options.bar.windowtitle.title_map}
                    title="Window Title Mappings"
                    subtitle="Requires Custom Title.\nWiki: https://hyprpanel.com/configuration/panel.html#window-title-mappings"
                    type="object"
                    subtitleLink="https://hyprpanel.com/configuration/panel.html#window-title-mappings"
                />
                <Option
                    opt={options.bar.windowtitle.class_name}
                    title="Use Class Name"
                    subtitle="If custom title is disabled, shows class name instead."
                    type="boolean"
                />
                <Option opt={options.bar.windowtitle.label} title="Show Window Title Label" type="boolean" />
                <Option opt={options.bar.windowtitle.icon} title="Show Icon" type="boolean" />
                <Option
                    opt={options.bar.windowtitle.truncation}
                    title="Truncate Window Title"
                    subtitle="Truncates the window title to a specified size."
                    type="boolean"
                />
                <Option opt={options.bar.windowtitle.truncation_size} title="Truncation Size" type="number" min={10} />
                <Option
                    opt={options.theme.bar.buttons.windowtitle.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.windowtitle.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.windowtitle.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.windowtitle.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.windowtitle.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.windowtitle.scrollDown} title="Scroll Down" type="string" />

                {/* Volume Section */}
                <Header title="Volume" />
                <Option opt={options.theme.bar.buttons.volume.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.volume.label} title="Show Volume Percentage" type="boolean" />
                <Option
                    opt={options.theme.bar.buttons.volume.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.volume.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.volume.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.volume.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.volume.scrollDown} title="Scroll Down" type="string" />

                {/* Network Section */}
                <Header title="Network" />
                <Option opt={options.theme.bar.buttons.network.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.network.label} title="Show Network Name" type="boolean" />
                <Option opt={options.bar.network.showWifiInfo} title="Show Wifi Info On Hover" type="boolean" />
                <Option
                    opt={options.bar.network.truncation}
                    title="Truncate Network Name"
                    subtitle="Truncates network name to specified size."
                    type="boolean"
                />
                <Option opt={options.bar.network.truncation_size} title="Truncation Size" type="number" />
                <Option
                    opt={options.theme.bar.buttons.network.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.network.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.network.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.network.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.network.scrollDown} title="Scroll Down" type="string" />

                {/* Bluetooth Section */}
                <Header title="Bluetooth" />
                <Option opt={options.theme.bar.buttons.bluetooth.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.bluetooth.label} title="Show Bluetooth Label" type="boolean" />
                <Option
                    opt={options.theme.bar.buttons.bluetooth.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.bluetooth.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.bluetooth.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.bluetooth.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.bluetooth.scrollDown} title="Scroll Down" type="string" />

                {/* Battery Section */}
                <Header title="Battery" />
                <Option opt={options.theme.bar.buttons.battery.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.battery.label} title="Show Battery Percentage" type="boolean" />
                <Option
                    opt={options.bar.battery.hideLabelWhenFull}
                    title="Hide Battery Percentage When Full"
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.buttons.battery.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.battery.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.battery.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.battery.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.battery.scrollDown} title="Scroll Down" type="string" />

                {/* System Tray Section */}
                <Header title="System Tray" />
                <Option opt={options.theme.bar.buttons.systray.enableBorder} title="Button Border" type="boolean" />
                <Option
                    opt={options.bar.systray.ignore}
                    title="Ignore List"
                    subtitle="Apps to ignore\nWiki: https://hyprpanel.com/configuration/panel.html#system-tray"
                    subtitleLink="https://hyprpanel.com/configuration/panel.html#system-tray"
                    type="object"
                />
                <Option
                    opt={options.bar.systray.customIcons}
                    title="Custom Systray Icons"
                    subtitle="Define custom icons for systray.\nWiki: https://hyprpanel.com/configuration/panel.html#custom-systray-icons"
                    subtitleLink="https://hyprpanel.com/configuration/panel.html#custom-systray-icons"
                    type="object"
                />

                {/* Clock Section */}
                <Header title="Clock" />
                <Option opt={options.theme.bar.buttons.clock.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.clock.format} title="Clock Format" type="string" />
                <Option opt={options.bar.clock.icon} title="Icon" type="string" />
                <Option opt={options.bar.clock.showIcon} title="Show Icon" type="boolean" />
                <Option opt={options.bar.clock.showTime} title="Show Time" type="boolean" />
                <Option
                    opt={options.theme.bar.buttons.clock.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.clock.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.clock.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.clock.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.clock.scrollDown} title="Scroll Down" type="string" />

                {/* Media Section */}
                <Header title="Media" />
                <Option opt={options.theme.bar.buttons.media.enableBorder} title="Button Border" type="boolean" />
                <Option
                    opt={options.theme.bar.buttons.media.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option
                    opt={options.bar.media.format}
                    title="Label Format"
                    subtitle="Placeholders: {title}, {artists}, {artist}, {album}, {name}, {identity}"
                    type="string"
                />
                <Option opt={options.bar.media.show_label} title="Toggle Media Label" type="boolean" />
                <Option
                    opt={options.bar.media.truncation}
                    title="Truncate Media Label"
                    subtitle="Requires Toggle Media Label."
                    type="boolean"
                />
                <Option
                    opt={options.bar.media.truncation_size}
                    title="Truncation Size"
                    subtitle="Requires Toggle Media Label."
                    type="number"
                    min={10}
                />
                <Option
                    opt={options.bar.media.show_active_only}
                    title="Auto Hide"
                    subtitle="Hide if no media detected."
                    type="boolean"
                />
                <Option opt={options.bar.media.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.media.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.media.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.media.scrollDown} title="Scroll Down" type="string" />

                {/* Notifications Section */}
                <Header title="Notifications" />
                <Option
                    opt={options.theme.bar.buttons.notifications.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option
                    opt={options.bar.notifications.show_total}
                    title="Show Total # of notifications"
                    type="boolean"
                />
                <Option
                    opt={options.bar.notifications.hideCountWhenZero}
                    title="Auto Hide Label"
                    subtitle="Hide label when zero notifications"
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.buttons.notifications.spacing}
                    title="Inner Spacing"
                    subtitle="Spacing between icon and label."
                    type="string"
                />
                <Option opt={options.bar.notifications.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.notifications.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.notifications.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.notifications.scrollDown} title="Scroll Down" type="string" />
            </box>
        </scrollable>
    );
};
