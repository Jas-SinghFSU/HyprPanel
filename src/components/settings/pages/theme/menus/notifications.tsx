import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const NotificationsMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Notifications Menu'}
            className="menu-theme-page notifications paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Notifications Menu Theme Settings Section */}
                <Header title="Notifications Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.notifications.label} title="Menu Label" type="color" />
                <Option opt={options.theme.bar.menus.menu.notifications.card} title="Card" type="color" />
                <Option opt={options.theme.bar.menus.menu.notifications.background} title="Background" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.no_notifications_label}
                    title="Empty Notifications Backdrop"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.notifications.border} title="Border" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.switch_divider}
                    title="Switch Divider"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.clear}
                    title="Clear Notifications Button"
                    type="color"
                />

                {/* Switch Section */}
                <Header title="Switch" />
                <Option opt={options.theme.bar.menus.menu.notifications.switch.enabled} title="Enabled" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.switch.disabled}
                    title="Disabled"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.notifications.switch.puck} title="Puck" type="color" />

                {/* Scrollbar Section */}
                <Header title="Scrollbar" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.scrollbar.color}
                    title="Scrollbar Color"
                    type="color"
                />

                {/* Pagination Section */}
                <Header title="Pagination" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.pager.background}
                    title="Pager Footer Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.pager.button}
                    title="Pager Button Color"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.pager.label}
                    title="Pager Label Color"
                    type="color"
                />
            </box>
        </scrollable>
    );
};
