import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const PowerMenuSettings = () => {
    return Widget.Scrollable({
        class_name: "bar-theme-page paged-container",
        vscroll: "always",
        hscroll: "automatic",
        vexpand: true,
        overlayScrolling: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Power Menu'),
                Option({ opt: options.menus.power.showLabel, title: 'Show Label', type: 'boolean' }),
                Option({ opt: options.menus.power.confirmation, title: 'Confirmation Dialog', type: 'boolean' }),
                Option({ opt: options.menus.power.shutdown, title: 'Shutdown Command', type: 'string' }),
                Option({ opt: options.menus.power.reboot, title: 'Reboot Command', type: 'string' }),
                Option({ opt: options.menus.power.logout, title: 'Logout Command', type: 'string' }),
                Option({ opt: options.menus.power.sleep, title: 'Sleep Command', type: 'string' }),
            ]
        })
    })
}
