import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const CustomModuleSettings = (): JSX.Element => {
    return (
        <scrollable
            name={'Custom Modules'}
            className="menu-theme-page customModules paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
        >
            <box className="menu-theme-page paged-container" vertical>
                {/* General Section */}
                <Header title="General" />
                <Option opt={options.bar.customModules.scrollSpeed} title="Scrolling Speed" type="number" />

                {/* RAM Section */}
                <Header title="RAM" />
                <Option opt={options.theme.bar.buttons.modules.ram.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.customModules.ram.icon} title="Ram Icon" type="string" />
                <Option opt={options.bar.customModules.ram.label} title="Show Label" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.ram.spacing} title="Spacing" type="string" />
                <Option
                    opt={options.bar.customModules.ram.labelType}
                    title="Label Type"
                    type="enum"
                    enums={['used/total', 'used', 'free', 'percentage']}
                />
                <Option opt={options.bar.customModules.ram.round} title="Round" type="boolean" />
                <Option
                    opt={options.bar.customModules.ram.pollingInterval}
                    title="Polling Interval"
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.ram.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.ram.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.ram.middleClick} title="Middle Click" type="string" />

                {/* CPU Section */}
                <Header title="CPU" />
                <Option opt={options.theme.bar.buttons.modules.cpu.enableBorder} title="Button Border" type="boolean" />
                <Option opt={options.bar.customModules.cpu.icon} title="Cpu Icon" type="string" />
                <Option opt={options.bar.customModules.cpu.label} title="Show Label" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.cpu.spacing} title="Spacing" type="string" />
                <Option opt={options.bar.customModules.cpu.round} title="Round" type="boolean" />
                <Option
                    opt={options.bar.customModules.cpu.pollingInterval}
                    title="Polling Interval"
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.cpu.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.cpu.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.cpu.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.cpu.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.cpu.scrollDown} title="Scroll Down" type="string" />

                {/* CPU Temperature Section */}
                <Header title="CPU Temperature" />
                <Option
                    opt={options.theme.bar.buttons.modules.cpuTemp.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option
                    opt={options.bar.customModules.cpuTemp.sensor}
                    title="CPU Temperature Sensor"
                    subtitle="Wiki: https://hyprpanel.com/configuration/panel.html#custom-modules"
                    subtitleLink="https://hyprpanel.com/configuration/panel.html#custom-modules"
                    type="string"
                />
                <Option
                    opt={options.bar.customModules.cpuTemp.unit}
                    title="CPU Temperature Unit"
                    type="enum"
                    enums={['imperial', 'metric']}
                />
                <Option opt={options.bar.customModules.cpuTemp.showUnit} title="Show Unit" type="boolean" />
                <Option opt={options.bar.customModules.cpuTemp.icon} title="Cpu Temperature Icon" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.label} title="Show Label" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.cpuTemp.spacing} title="Spacing" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.round} title="Round" type="boolean" />
                <Option
                    opt={options.bar.customModules.cpuTemp.pollingInterval}
                    title="Polling Interval"
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.cpuTemp.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.cpuTemp.scrollDown} title="Scroll Down" type="string" />

                {/* Storage Section */}
                <Header title="Storage" />
                <Option
                    opt={options.theme.bar.buttons.modules.storage.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option opt={options.bar.customModules.storage.icon} title="Storage Icon" type="string" />
                <Option opt={options.bar.customModules.storage.label} title="Show Label" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.storage.spacing} title="Spacing" type="string" />
                <Option
                    opt={options.bar.customModules.storage.labelType}
                    title="Label Type"
                    type="enum"
                    enums={['used/total', 'used', 'free', 'percentage']}
                />
                <Option opt={options.bar.customModules.storage.round} title="Round" type="boolean" />
                <Option
                    opt={options.bar.customModules.storage.pollingInterval}
                    title="Polling Interval"
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.storage.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.storage.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.storage.middleClick} title="Middle Click" type="string" />

                {/* Netstat Section */}
                <Header title="Netstat" />
                <Option
                    opt={options.theme.bar.buttons.modules.netstat.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option
                    opt={options.bar.customModules.netstat.networkInterface}
                    title="Network Interface"
                    subtitle="Wiki: https://hyprpanel.com/configuration/panel.html#custom-modules"
                    type="string"
                />
                <Option
                    opt={options.bar.customModules.netstat.dynamicIcon}
                    title="Use Network Icon"
                    subtitle="If enabled, shows current network icon indicators instead of static icon"
                    type="boolean"
                />
                <Option opt={options.bar.customModules.netstat.icon} title="Netstat Icon" type="string" />
                <Option opt={options.bar.customModules.netstat.label} title="Show Label" type="boolean" />
                <Option
                    opt={options.bar.customModules.netstat.rateUnit}
                    title="Rate Unit"
                    type="enum"
                    enums={['GiB', 'MiB', 'KiB', 'auto']}
                />
                <Option opt={options.theme.bar.buttons.modules.netstat.spacing} title="Spacing" type="string" />
                <Option
                    opt={options.bar.customModules.netstat.labelType}
                    title="Label Type"
                    type="enum"
                    enums={['full', 'in', 'out']}
                />
                <Option opt={options.bar.customModules.netstat.round} title="Round" type="boolean" />
                <Option
                    opt={options.bar.customModules.netstat.pollingInterval}
                    title="Polling Interval"
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.netstat.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.netstat.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.netstat.middleClick} title="Middle Click" type="string" />

                {/* Keyboard Layout Section */}
                <Header title="Keyboard Layout" />
                <Option
                    opt={options.theme.bar.buttons.modules.kbLayout.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option opt={options.bar.customModules.kbLayout.icon} title="Keyboard Layout Icon" type="string" />
                <Option opt={options.bar.customModules.kbLayout.label} title="Show Label" type="boolean" />
                <Option
                    opt={options.bar.customModules.kbLayout.labelType}
                    title="Label Type"
                    type="enum"
                    enums={['layout', 'code']}
                />
                <Option opt={options.theme.bar.buttons.modules.kbLayout.spacing} title="Spacing" type="string" />
                <Option opt={options.bar.customModules.kbLayout.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.kbLayout.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.kbLayout.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.kbLayout.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.kbLayout.scrollDown} title="Scroll Down" type="string" />

                {/* Updates Section */}
                <Header title="Updates" />
                <Option
                    opt={options.theme.bar.buttons.modules.updates.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option
                    opt={options.bar.customModules.updates.updateCommand}
                    title="Check Updates Command"
                    type="string"
                />
                <Option opt={options.bar.customModules.updates.icon} title="Updates Icon" type="string" />
                <Option opt={options.bar.customModules.updates.label} title="Show Label" type="boolean" />
                <Option opt={options.bar.customModules.updates.padZero} title="Pad with 0" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.updates.spacing} title="Spacing" type="string" />
                <Option
                    opt={options.bar.customModules.updates.pollingInterval}
                    title="Polling Interval"
                    subtitle="WARNING: Be careful of your package manager's rate limit."
                    type="number"
                    min={100}
                    max={60 * 24 * 1000}
                    increment={1000}
                />
                <Option opt={options.bar.customModules.updates.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.updates.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.updates.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.updates.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.updates.scrollDown} title="Scroll Down" type="string" />

                {/* Submap Section */}
                <Header title="Submap" />
                <Option
                    opt={options.theme.bar.buttons.modules.submap.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option
                    opt={options.bar.customModules.submap.showSubmapName}
                    title="Show Submap Name"
                    subtitle="Displays current submap name instead of Enabled/Disabled text."
                    type="boolean"
                />
                <Option opt={options.bar.customModules.submap.enabledIcon} title="Enabled Icon" type="string" />
                <Option opt={options.bar.customModules.submap.disabledIcon} title="Disabled Icon" type="string" />
                <Option opt={options.bar.customModules.submap.enabledText} title="Enabled Text" type="string" />
                <Option opt={options.bar.customModules.submap.disabledText} title="Disabled Text" type="string" />
                <Option opt={options.bar.customModules.submap.label} title="Show Label" type="boolean" />
                <Option opt={options.theme.bar.buttons.modules.submap.spacing} title="Spacing" type="string" />
                <Option opt={options.bar.customModules.submap.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.submap.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.submap.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.submap.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.submap.scrollDown} title="Scroll Down" type="string" />

                {/* Weather Section */}
                <Header title="Weather" />
                <Option
                    opt={options.theme.bar.buttons.modules.weather.enableBorder}
                    title="Button Border"
                    type="boolean"
                />
                <Option opt={options.bar.customModules.weather.label} title="Show Label" type="boolean" />
                <Option
                    opt={options.bar.customModules.weather.unit}
                    title="Units"
                    type="enum"
                    enums={['imperial', 'metric']}
                />
                <Option opt={options.theme.bar.buttons.modules.weather.spacing} title="Spacing" type="string" />
                <Option opt={options.bar.customModules.weather.leftClick} title="Left Click" type="string" />
                <Option opt={options.bar.customModules.weather.rightClick} title="Right Click" type="string" />
                <Option opt={options.bar.customModules.weather.middleClick} title="Middle Click" type="string" />
                <Option opt={options.bar.customModules.weather.scrollUp} title="Scroll Up" type="string" />
                <Option opt={options.bar.customModules.weather.scrollDown} title="Scroll Down" type="string" />
            </box>
        </scrollable>
    );
};