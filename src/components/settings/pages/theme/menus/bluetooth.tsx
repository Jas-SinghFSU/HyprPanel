import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const BluetoothMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Bluetooth Menu'}
            className="menu-theme-page bluetooth paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Bluetooth Menu Theme Settings Section */}
                <Header title="Bluetooth Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.text} title="Text" type="color" />

                {/* Card Section */}
                <Header title="Card" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.card.color} title="Card" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.background.color} title="Background" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.border.color} title="Border" type="color" />

                {/* Label Section */}
                <Header title="Label" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.label.color} title="Label" type="color" />

                {/* Status Section */}
                <Header title="Status" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.status} title="Connection Status" type="color" />

                {/* List Items Section */}
                <Header title="List Items" />
                <Option
                    opt={options.theme.bar.menus.menu.bluetooth.listitems.active}
                    title="Active/Hover"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.bluetooth.listitems.passive} title="Passive" type="color" />

                {/* Icons Section */}
                <Header title="Icons" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.icons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.icons.passive} title="Passive" type="color" />

                {/* Icon Buttons Section */}
                <Header title="Icon Buttons" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.iconbutton.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.iconbutton.passive} title="Passive" type="color" />

                {/* Scroller Section */}
                <Header title="Scroller" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.scroller.color} title="Color" type="color" />

                {/* Switch Section */}
                <Header title="Switch" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.switch.enabled} title="Enabled" type="color" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.switch.disabled} title="Disabled" type="color" />
                <Option opt={options.theme.bar.menus.menu.bluetooth.switch.puck} title="Puck" type="color" />

                {/* Switch Divider Section */}
                <Header title="Switch Divider" />
                <Option
                    opt={options.theme.bar.menus.menu.bluetooth.switch_divider}
                    title="Switch Divider"
                    type="color"
                />
            </box>
        </scrollable>
    );
};
