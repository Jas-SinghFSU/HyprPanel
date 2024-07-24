import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const NotificationSettings = () => {
    return Widget.Box({
        class_name: "bar-theme-page paged-container",
        vertical: true,
        children: [
            Header('Notification Settings'),
            Option({ opt: options.notifications.position, title: 'Notification Location', type: 'enum', enums: ['top left', 'top', 'top right', 'bottom right', 'bottom', 'bottom left'] }),
        ]
    })
}
