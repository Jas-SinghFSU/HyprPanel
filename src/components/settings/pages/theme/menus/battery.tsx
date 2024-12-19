import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const BatteryMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Battery Menu'}
            className="menu-theme-page battery paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Battery Menu Theme Settings Section */}
                <Header title="Battery Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.battery.text} title="Text" type="color" />

                {/* Card Section */}
                <Header title="Card" />
                <Option opt={options.theme.bar.menus.menu.battery.card.color} title="Card" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.battery.background.color} title="Background" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.menu.battery.border.color} title="Border" type="color" />

                {/* Label Section */}
                <Header title="Label" />
                <Option opt={options.theme.bar.menus.menu.battery.label.color} title="Label" type="color" />

                {/* List Items Section */}
                <Header title="List Items" />
                <Option opt={options.theme.bar.menus.menu.battery.listitems.active} title="Active/Hover" type="color" />
                <Option opt={options.theme.bar.menus.menu.battery.listitems.passive} title="Passive" type="color" />

                {/* Icons Section */}
                <Header title="Icons" />
                <Option opt={options.theme.bar.menus.menu.battery.icons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.menu.battery.icons.passive} title="Passive" type="color" />

                {/* Slider Section */}
                <Header title="Slider" />
                <Option opt={options.theme.bar.menus.menu.battery.slider.primary} title="Primary" type="color" />
                <Option opt={options.theme.bar.menus.menu.battery.slider.background} title="Background" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.battery.slider.backgroundhover}
                    title="Background (Hover)"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.battery.slider.puck} title="Puck" type="color" />
            </box>
        </scrollable>
    );
};
