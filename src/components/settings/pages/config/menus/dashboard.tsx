import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const DashboardMenuSettings = (): JSX.Element => {
    return (
        <scrollable
            name={'Dashboard Menu'}
            className="bar-theme-page paged-container"
            vscroll={Gtk.PolicyType.ALWAYS}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand
            overlayScrolling
        >
            <box vertical>
                <Header title="Power Menu" />
                <Option
                    opt={options.menus.dashboard.powermenu.avatar.image}
                    title="Profile Image"
                    type="img"
                    subtitle="By default uses '~/.face.icon'"
                />
                <Option
                    opt={options.menus.dashboard.powermenu.avatar.name}
                    title="Profile Name"
                    subtitle="Use 'system' for auto system name"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.profile.size}
                    title="Profile Image Size"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.profile.radius}
                    title="Profile Image Radius"
                    type="string"
                />

                <Option
                    opt={options.menus.dashboard.powermenu.confirmation}
                    title="Show Confirmation Dialogue"
                    type="boolean"
                />
                <Option opt={options.menus.dashboard.powermenu.shutdown} title="Shutdown Command" type="string" />
                <Option opt={options.menus.dashboard.powermenu.reboot} title="Reboot Command" type="string" />
                <Option opt={options.menus.dashboard.powermenu.logout} title="Logout Command" type="string" />
                <Option opt={options.menus.dashboard.powermenu.sleep} title="Sleep Command" type="string" />

                <Header title="Controls" />
                <Option opt={options.menus.dashboard.controls.enabled} title="Enabled" type="boolean" />

                <Header title="Resource Usage Metrics" />
                <Option opt={options.menus.dashboard.stats.enabled} title="Enabled" type="boolean" />
                <Option
                    opt={options.menus.dashboard.stats.enable_gpu}
                    title="Track GPU"
                    subtitle="Only for NVidia + python-gpustat"
                    type="boolean"
                />
                <Option
                    opt={options.menus.dashboard.stats.interval}
                    title="Update Interval"
                    subtitle="Frequency of system metrics polling."
                    type="number"
                    min={100}
                    increment={500}
                />

                <Header title="Shortcuts" />
                <Option opt={options.menus.dashboard.shortcuts.enabled} title="Enabled" type="boolean" />
                {/* Left Shortcuts */}
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut1.icon}
                    title="Left - Shortcut 1 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut1.command}
                    title="Left - Shortcut 1 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut1.tooltip}
                    title="Left - Shortcut 1 (Tooltip)"
                    type="string"
                />

                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut2.icon}
                    title="Left - Shortcut 2 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut2.command}
                    title="Left - Shortcut 2 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut2.tooltip}
                    title="Left - Shortcut 2 (Tooltip)"
                    type="string"
                />

                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut3.icon}
                    title="Left - Shortcut 3 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut3.command}
                    title="Left - Shortcut 3 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut3.tooltip}
                    title="Left - Shortcut 3 (Tooltip)"
                    type="string"
                />

                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut4.icon}
                    title="Left - Shortcut 4 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut4.command}
                    title="Left - Shortcut 4 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.left.shortcut4.tooltip}
                    title="Left - Shortcut 4 (Tooltip)"
                    type="string"
                />

                {/* Right Shortcuts */}
                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut1.icon}
                    title="Right - Shortcut 1 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut1.command}
                    title="Right - Shortcut 1 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut1.tooltip}
                    title="Right - Shortcut 1 (Tooltip)"
                    type="string"
                />

                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut3.icon}
                    title="Right - Shortcut 3 (Icon)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut3.command}
                    title="Right - Shortcut 3 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.shortcuts.right.shortcut3.tooltip}
                    title="Right - Shortcut 3 (Tooltip)"
                    type="string"
                />

                <Header title="Directories" />
                <Option opt={options.menus.dashboard.directories.enabled} title="Enabled" type="boolean" />

                {/* Left Directories */}
                <Option
                    opt={options.menus.dashboard.directories.left.directory1.label}
                    title="Left - Directory 1 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.left.directory1.command}
                    title="Left - Directory 1 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.left.directory2.label}
                    title="Left - Directory 2 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.left.directory2.command}
                    title="Left - Directory 2 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.left.directory3.label}
                    title="Left - Directory 3 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.left.directory3.command}
                    title="Left - Directory 3 (Command)"
                    type="string"
                />

                {/* Right Directories */}
                <Option
                    opt={options.menus.dashboard.directories.right.directory1.label}
                    title="Right - Directory 1 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.right.directory1.command}
                    title="Right - Directory 1 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.right.directory2.label}
                    title="Right - Directory 2 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.right.directory2.command}
                    title="Right - Directory 2 (Command)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.right.directory3.label}
                    title="Right - Directory 3 (Label)"
                    type="string"
                />
                <Option
                    opt={options.menus.dashboard.directories.right.directory3.command}
                    title="Right - Directory 3 (Command)"
                    type="string"
                />
            </box>
        </scrollable>
    );
};
