import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const BarGeneral = (): JSX.Element => {
    return (
        <scrollable name={'General'} className="bar-theme-page paged-container" vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box vertical>
                <Header title="General Settings" />
                <Option
                    opt={options.theme.font.name}
                    fontLabel={options.theme.font.label}
                    fontStyle={options.theme.font.style}
                    title="Font"
                    type="font"
                />
                <Option opt={options.theme.font.size} title="Font Size" type="string" />
                <Option
                    opt={options.theme.font.weight}
                    title="Font Weight"
                    subtitle="100, 200, 300, etc."
                    type="number"
                    increment={100}
                    min={100}
                    max={900}
                />
                <Option
                    opt={options.dummy}
                    title="Config"
                    subtitle="WARNING: Importing a configuration will replace your current configuration settings."
                    type="config_import"
                    exportData={{ filePath: CONFIG, themeOnly: false }}
                />
                <Option
                    opt={options.hyprpanel.restartAgs}
                    title="Restart Hyprpanel On Wake Or Monitor Connection"
                    subtitle="WARNING: Disabling this may cause bar issues on sleep/monitor connect."
                    type="boolean"
                />
                <Option
                    opt={options.hyprpanel.restartCommand}
                    title="Restart Command"
                    subtitle="Command executed when restarting. Use '-b busName' flag if needed."
                    type="string"
                />
                <Option opt={options.terminal} title="Terminal" subtitle="For tools like 'btop'" type="string" />
                <Option
                    opt={options.tear}
                    title="Tearing Compatible"
                    subtitle="Switches overlays to 'top' layer for tearing compatibility."
                    type="boolean"
                />
                <Option
                    opt={options.menus.transition}
                    title="Menu Transition"
                    type="enum"
                    enums={['none', 'crossfade']}
                />
                <Option
                    opt={options.menus.transitionTime}
                    title="Menu Transition Duration"
                    type="number"
                    min={0}
                    max={10000}
                    increment={25}
                />
                <Option opt={options.theme.bar.menus.enableShadow} title="Enable Shadow" type="boolean" />
                <Option
                    opt={options.theme.bar.menus.shadow}
                    title="Menu Shadow"
                    subtitle="Requires that sufficient margins have been set to house the shadow."
                    type="string"
                />
                <Option
                    opt={options.theme.bar.menus.shadowMargins}
                    title="Menu Shadow Margins"
                    subtitle="Margins count mouse events as clicks 'inside' the menu."
                    type="string"
                />

                <Header title="Scaling" />
                <Option
                    opt={options.scalingPriority}
                    title="Scaling Priority"
                    type="enum"
                    enums={['both', 'gdk', 'hyprland']}
                />
                <Option opt={options.theme.bar.scaling} title="Bar" type="number" min={1} max={100} increment={5} />
                <Option
                    opt={options.theme.notification.scaling}
                    title="Notifications"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option opt={options.theme.osd.scaling} title="OSD" type="number" min={1} max={100} increment={5} />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.scaling}
                    title="Dashboard Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.dashboard.confirmation_scaling}
                    title="Confirmation Dialog"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.media.scaling}
                    title="Media Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.volume.scaling}
                    title="Volume Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.network.scaling}
                    title="Network Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.bluetooth.scaling}
                    title="Bluetooth Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.battery.scaling}
                    title="Battery Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.clock.scaling}
                    title="Clock Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.scaling}
                    title="Notifications Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.menu.power.scaling}
                    title="Power Menu"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.tooltip.scaling}
                    title="Tooltips"
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
                <Option
                    opt={options.theme.bar.menus.popover.scaling}
                    title="Popovers"
                    subtitle="e.g., Right click menu of system tray items."
                    type="number"
                    min={1}
                    max={100}
                    increment={5}
                />
            </box>
        </scrollable>
    );
};
