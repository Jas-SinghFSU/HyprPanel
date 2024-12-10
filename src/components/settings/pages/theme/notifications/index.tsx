import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const NotificationsTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Notifications'}
            className="notifications-theme-page paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Notifications Theme Settings Section */}
                <Header title="Notifications Theme Settings" />
                <Option opt={options.theme.notification.background} title="Notification Background" type="color" />
                <Option
                    opt={options.theme.notification.opacity}
                    title="Notification Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option
                    opt={options.theme.notification.actions.background}
                    title="Action Button Background"
                    subtitle="Buttons that perform actions within a notification"
                    type="color"
                />
                <Option opt={options.theme.notification.actions.text} title="Action Button Text Color" type="color" />
                <Option opt={options.theme.notification.label} title="Label" type="color" />
                <Option opt={options.theme.notification.border} title="Border" type="color" />
                <Option opt={options.theme.notification.time} title="Time Stamp" type="color" />
                <Option opt={options.theme.notification.text} title="Body Text" type="color" />
                <Option
                    opt={options.theme.notification.labelicon}
                    title="Label Icon"
                    subtitle="Icon that accompanies the label. Doesn't apply if icon is an app icon."
                    type="color"
                />
                <Option opt={options.theme.notification.close_button.background} title="Dismiss Button" type="color" />
                <Option opt={options.theme.notification.close_button.label} title="Dismiss Button Text" type="color" />
            </box>
        </scrollable>
    );
};
