import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const NetworkMenuTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "never",
        class_name: "menu-theme-page network paged-container",
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Network Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.network.text, title: 'Text', type: 'color' }),

                Header('Card'),
                Option({ opt: options.theme.bar.menus.menu.network.card.color, title: 'Card', type: 'color' }),

                Header('Background'),
                Option({ opt: options.theme.bar.menus.menu.network.background.color, title: 'Background', type: 'color' }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.network.border.color, title: 'Border', type: 'color' }),

                Header('Label'),
                Option({ opt: options.theme.bar.menus.menu.network.label.color, title: 'Label', type: 'color' }),

                Header('Status'),
                Option({ opt: options.theme.bar.menus.menu.network.status.color, title: 'Connection Status', type: 'color' }),

                Header('List Items'),
                Option({ opt: options.theme.bar.menus.menu.network.listitems.active, title: 'Active/Hover', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.network.listitems.passive, title: 'Passive', type: 'color' }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.menu.network.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.network.icons.passive, title: 'Passive', type: 'color' }),

                Header('Icon Buttons'),
                Option({ opt: options.theme.bar.menus.menu.network.iconbuttons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.network.iconbuttons.passive, title: 'Passive', type: 'color' }),
            ]
        })
    })
}
