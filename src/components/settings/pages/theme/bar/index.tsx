import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const BarTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Bar'}
            className="bar-theme-page paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={false}
        >
            <box vertical>
                {/* General Section */}
                <Header title="General" />
                <Option opt={options.theme.bar.transparent} title="Transparent" type="boolean" />
                <Option opt={options.theme.bar.background} title="Background Color" type="color" />
                <Option
                    opt={options.theme.bar.buttons.style}
                    title="Button Style"
                    type="enum"
                    enums={['default', 'split', 'wave', 'wave2']}
                />
                <Option
                    opt={options.theme.bar.opacity}
                    title="Background Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option opt={options.theme.bar.border.color} title="Bar Border Color" type="color" />
                <Option
                    opt={options.theme.bar.buttons.opacity}
                    title="Button Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.theme.bar.buttons.background_opacity}
                    title="Button Background Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.theme.bar.buttons.background_hover_opacity}
                    title="Button Background Hover Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.theme.bar.buttons.monochrome}
                    title="Use Global Colors"
                    type="boolean"
                    disabledBinding={options.theme.matugen}
                />
                <Option opt={options.theme.bar.buttons.background} title="Button Background" type="color" />
                <Option opt={options.theme.bar.buttons.borderColor} title="Button Border" type="color" />
                <Option opt={options.theme.bar.buttons.text} title="Button Text" type="color" />
                <Option opt={options.theme.bar.buttons.icon} title="Button Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />

                {/* Dashboard Button Section */}
                <Header title="Dashboard Button" />
                <Option opt={options.theme.bar.buttons.dashboard.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.dashboard.icon} title="Icon" type="color" />
                <Option opt={options.theme.bar.buttons.dashboard.border} title="Border" type="color" />

                {/* Workspaces Section */}
                <Header title="Workspaces" />
                <Option opt={options.theme.bar.buttons.workspaces.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.workspaces.hover} title="Workspace Hover Color" type="color" />
                <Option
                    opt={options.theme.bar.buttons.workspaces.available}
                    title="Workspace Available Color"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.occupied}
                    title="Workspace Occupied Color"
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.workspaces.active} title="Workspace Active Color" type="color" />
                <Option
                    opt={options.theme.bar.buttons.workspaces.numbered_active_highlighted_text_color}
                    title="Highlighted Workspace Text Color"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.workspaces.numbered_active_underline_color}
                    title="Workspace Underline Color"
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.workspaces.border} title="Border" type="color" />

                {/* Window Title Section */}
                <Header title="Window Title" />
                <Option opt={options.theme.bar.buttons.windowtitle.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.windowtitle.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.windowtitle.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.windowtitle.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.windowtitle.border} title="Border" type="color" />

                {/* Media Section */}
                <Header title="Media" />
                <Option opt={options.theme.bar.buttons.media.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.media.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.media.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.media.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.media.border} title="Border" type="color" />

                {/* Volume Section */}
                <Header title="Volume" />
                <Option opt={options.theme.bar.buttons.volume.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.volume.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.volume.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.volume.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.volume.border} title="Border" type="color" />

                {/* Network Section */}
                <Header title="Network" />
                <Option opt={options.theme.bar.buttons.network.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.network.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.network.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.network.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.network.border} title="Border" type="color" />

                {/* Bluetooth Section */}
                <Header title="Bluetooth" />
                <Option opt={options.theme.bar.buttons.bluetooth.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.bluetooth.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.bluetooth.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.bluetooth.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.bluetooth.border} title="Border" type="color" />

                {/* System Tray Section */}
                <Header title="System Tray" />
                <Option opt={options.theme.bar.buttons.systray.border} title="Border" type="color" />
                <Option opt={options.theme.bar.buttons.systray.customIcon} title="Custom Icons" type="color" />
                <Option opt={options.theme.bar.buttons.systray.background} title="Background" type="color" />

                {/* Battery Section */}
                <Header title="Battery" />
                <Option opt={options.theme.bar.buttons.battery.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.battery.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.battery.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.battery.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.battery.border} title="Border" type="color" />

                {/* Clock Section */}
                <Header title="Clock" />
                <Option opt={options.theme.bar.buttons.clock.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.clock.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.clock.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.clock.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.clock.border} title="Border" type="color" />

                {/* Notifications Section */}
                <Header title="Notifications" />
                <Option opt={options.theme.bar.buttons.notifications.background} title="Background" type="color" />
                <Option opt={options.theme.bar.buttons.notifications.total} title="Notification Count" type="color" />
                <Option opt={options.theme.bar.buttons.notifications.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.notifications.icon_background}
                    title="Button Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.notifications.border} title="Border" type="color" />
            </box>
        </scrollable>
    );
};
