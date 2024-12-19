import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const SystrayMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'System Tray'}
            className="menu-theme-page systray paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Dropdown Menu Section */}
                <Header title="Dropdown Menu" />
                <Option
                    opt={options.theme.bar.menus.menu.systray.dropdownmenu.background}
                    title="Background"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.systray.dropdownmenu.text} title="Text" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.systray.dropdownmenu.divider}
                    title="Section Divider"
                    type="color"
                />
            </box>
        </scrollable>
    );
};
