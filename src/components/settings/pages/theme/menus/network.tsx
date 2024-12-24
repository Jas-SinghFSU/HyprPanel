import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const NetworkMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Network Menu'}
            className="menu-theme-page network paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Network Menu Theme Settings Section */}
                <Header title="Network Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.network.text} title="Text" type="color" />

                {/* Card Section */}
                <Header title="Card" />
                <Option opt={options.theme.bar.menus.menu.network.card.color} title="Card" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.network.background.color} title="Background" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.menu.network.border.color} title="Border" type="color" />

                {/* Label Section */}
                <Header title="Label" />
                <Option opt={options.theme.bar.menus.menu.network.label.color} title="Label" type="color" />

                {/* Status Section */}
                <Header title="Status" />
                <Option
                    opt={options.theme.bar.menus.menu.network.status.color}
                    title="Connection Status"
                    type="color"
                />

                {/* Switch Section */}
                <Header title="Switch" />
                <Option opt={options.theme.bar.menus.menu.network.switch.enabled} title="Enabled" type="color" />
                <Option opt={options.theme.bar.menus.menu.network.switch.disabled} title="Disabled" type="color" />
                <Option opt={options.theme.bar.menus.menu.network.switch.puck} title="Puck" type="color" />

                {/* List Items Section */}
                <Header title="List Items" />
                <Option opt={options.theme.bar.menus.menu.network.listitems.active} title="Active/Hover" type="color" />
                <Option opt={options.theme.bar.menus.menu.network.listitems.passive} title="Passive" type="color" />

                {/* Icons Section */}
                <Header title="Icons" />
                <Option opt={options.theme.bar.menus.menu.network.icons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.menu.network.icons.passive} title="Passive" type="color" />

                {/* Scroller Section */}
                <Header title="Scroller" />
                <Option opt={options.theme.bar.menus.menu.network.scroller.color} title="Color" type="color" />

                {/* Icon Buttons Section */}
                <Header title="Icon Buttons" />
                <Option opt={options.theme.bar.menus.menu.network.iconbuttons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.menu.network.iconbuttons.passive} title="Passive" type="color" />
            </box>
        </scrollable>
    );
};
