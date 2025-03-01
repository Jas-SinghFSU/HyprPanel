import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const NotificationSettings = (): JSX.Element => {
    return (
        <scrollable name={'Notifications'} vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className="bar-theme-page paged-container" vertical>
                <Header title="Notification Settings" />
                <Option
                    opt={options.notifications.ignore}
                    title="Ignored Applications"
                    subtitle="Wiki: https://hyprpanel.com/configuration/notifications.html#ignored-applications"
                    subtitleLink="https://hyprpanel.com/configuration/notifications.html#ignored-applications"
                    type="object"
                />
                <Option
                    opt={options.notifications.position}
                    title="Notification Location"
                    type="enum"
                    enums={['top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left']}
                />
                <Option opt={options.theme.notification.border_radius} title="Border Radius" type="string" />
                <Option opt={options.theme.notification.enableShadow} title="Enable Shadow" type="boolean" />
                <Option
                    opt={options.theme.notification.shadow}
                    title="Notification Shadow"
                    subtitle="Requires that sufficient margins have been set to house the shadow."
                    type="string"
                />
                <Option
                    opt={options.theme.notification.shadowMargins}
                    title="Notification Shadow Margins"
                    type="string"
                />
                <Option
                    opt={options.notifications.monitor}
                    title="Monitor"
                    subtitle="ID of the monitor to display notifications"
                    type="number"
                />
                <Option
                    opt={options.notifications.showActionsOnHover}
                    title="Show Actions only on Hover"
                    subtitle="Actions appear on hover"
                    type="boolean"
                />
                <Option
                    opt={options.notifications.active_monitor}
                    title="Follow Cursor"
                    subtitle="Notifications follow the monitor of your cursor"
                    type="boolean"
                />
                <Option
                    opt={options.notifications.clearDelay}
                    title="Clear Delay"
                    subtitle="Delay in ms before clearing a notification"
                    type="number"
                    increment={20}
                />
                <Option
                    opt={options.notifications.timeout}
                    title="Popup Timeout"
                    subtitle="Duration in ms the notification popup stays visible"
                    type="number"
                />
                <Option
                    opt={options.notifications.autoDismiss}
                    title="Automatically Dismiss"
                    subtitle="Notifications with a timeout will dismiss automatically."
                    type="boolean"
                />
                <Option
                    opt={options.notifications.cache_actions}
                    title="Preserve Actions"
                    subtitle="Persist action buttons after reboot."
                    type="boolean"
                />

                <Header title="Notification Menu Settings" />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.height}
                    title="Notification Menu Height"
                    type="string"
                />
                <Option
                    opt={options.notifications.displayedTotal}
                    title="Displayed Total"
                    subtitle="Number of notifications to show at once."
                    type="number"
                    min={1}
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.pager.show}
                    title="Show Pager"
                    subtitle="Shows pagination footer."
                    type="boolean"
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.scrollbar.width}
                    title="Scrollbar Width"
                    type="string"
                />
                <Option
                    opt={options.theme.bar.menus.menu.notifications.scrollbar.radius}
                    title="Scrollbar Radius"
                    type="string"
                />
            </box>
        </scrollable>
    );
};
