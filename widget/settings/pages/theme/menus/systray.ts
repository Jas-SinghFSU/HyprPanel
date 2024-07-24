import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const SystrayMenuTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "never",
        class_name: "menu-theme-page systray paged-container",
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Dropdown Menu'),
                Option({ opt: options.theme.bar.menus.menu.systray.dropdownmenu.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.systray.dropdownmenu.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.systray.dropdownmenu.divider, title: 'Section Divider', type: 'color' }),
            ]
        })
    })
}
