import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const CustomModuleTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Custom Modules'}
            className="menu-theme-page customModules paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={false}
        >
            <box vertical>
                {/* Microphone Module Section */}
                <Header title="Microphone" />
                <Option opt={options.theme.bar.buttons.modules.microphone.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.microphone.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.microphone.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.microphone.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.microphone.border} title="Border" type="color" />

                {/* RAM Module Section */}
                <Header title="RAM" />
                <Option opt={options.theme.bar.buttons.modules.ram.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.ram.icon} title="Icon" type="color" />
                <Option opt={options.theme.bar.buttons.modules.ram.background} title="Label Background" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.ram.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.ram.border} title="Border" type="color" />

                {/* CPU Module Section */}
                <Header title="CPU" />
                <Option opt={options.theme.bar.buttons.modules.cpu.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.cpu.icon} title="Icon" type="color" />
                <Option opt={options.theme.bar.buttons.modules.cpu.background} title="Label Background" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.cpu.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.cpu.border} title="Border" type="color" />

                {/* CPU Temperature Module Section */}
                <Header title="CPU Temperature" />
                <Option opt={options.theme.bar.buttons.modules.cpuTemp.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.cpuTemp.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.cpuTemp.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.cpuTemp.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.cpuTemp.border} title="Border" type="color" />

                {/* Storage Module Section */}
                <Header title="Storage" />
                <Option opt={options.theme.bar.buttons.modules.storage.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.storage.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.storage.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.storage.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.storage.border} title="Border" type="color" />

                {/* Netstat Module Section */}
                <Header title="Netstat" />
                <Option opt={options.theme.bar.buttons.modules.netstat.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.netstat.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.netstat.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.netstat.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.netstat.border} title="Border" type="color" />

                {/* Keyboard Layout Module Section */}
                <Header title="Keyboard Layout" />
                <Option opt={options.theme.bar.buttons.modules.kbLayout.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.kbLayout.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.kbLayout.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.kbLayout.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.kbLayout.border} title="Border" type="color" />

                {/* Updates Module Section */}
                <Header title="Updates" />
                <Option opt={options.theme.bar.buttons.modules.updates.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.updates.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.updates.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.updates.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.updates.border} title="Border" type="color" />

                {/* Submap Module Section */}
                <Header title="Submap" />
                <Option opt={options.theme.bar.buttons.modules.submap.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.submap.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.submap.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.submap.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.submap.border} title="Border" type="color" />

                {/* Weather Module Section */}
                <Header title="Weather" />
                <Option opt={options.theme.bar.buttons.modules.weather.icon} title="Icon" type="color" />
                <Option opt={options.theme.bar.buttons.modules.weather.text} title="Text" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.weather.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.weather.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.weather.border} title="Border" type="color" />

                {/* Hyprsunset Module Section */}
                <Header title="Hyprsunset" />
                <Option opt={options.theme.bar.buttons.modules.hyprsunset.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.hyprsunset.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.hyprsunset.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.hyprsunset.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.hyprsunset.border} title="Border" type="color" />

                {/* Hypridle Module Section */}
                <Header title="Hypridle" />
                <Option opt={options.theme.bar.buttons.modules.hypridle.text} title="Text" type="color" />
                <Option opt={options.theme.bar.buttons.modules.hypridle.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.hypridle.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.hypridle.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.hypridle.border} title="Border" type="color" />

                {/* Cava Module Section */}
                <Header title="Cava" />
                <Option opt={options.theme.bar.buttons.modules.cava.text} title="Bars" type="color" />
                <Option opt={options.theme.bar.buttons.modules.cava.icon} title="Icon" type="color" />
                <Option opt={options.theme.bar.buttons.modules.cava.background} title="Label Background" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.cava.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.cava.border} title="Border" type="color" />

                {/* Power Module Section */}
                <Header title="Power" />
                <Option opt={options.theme.bar.buttons.modules.power.icon} title="Icon" type="color" />
                <Option
                    opt={options.theme.bar.buttons.modules.power.background}
                    title="Label Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.buttons.modules.power.icon_background}
                    title="Icon Background"
                    subtitle="Applies a background color to the icon section of the button.\nRequires 'split' button styling."
                    type="color"
                />
                <Option opt={options.theme.bar.buttons.modules.power.border} title="Border" type="color" />
            </box>
        </scrollable>
    );
};
