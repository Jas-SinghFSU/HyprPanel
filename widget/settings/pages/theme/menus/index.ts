import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const MenuTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "never",
        class_name: "menu-theme-page",
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('General'),
                Option({ opt: options.theme.bar.menus.monochrome, title: 'Use Global Colors', type: 'boolean' }),
                Option({ opt: options.theme.bar.menus.background, title: 'Background Color', type: 'color' }),
                Option({ opt: options.theme.bar.menus.cards, title: 'Cards', type: 'color' }),
                Option({ opt: options.theme.bar.menus.card_radius, title: 'Card Radius', type: 'string' }),
                Option({ opt: options.theme.bar.menus.text, title: 'Primary Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.dimtext, title: 'Dim Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.feinttext, title: 'Feint Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.label, title: 'Label Color', type: 'color' }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.border.size, title: 'Border Width', type: 'string' }),
                Option({ opt: options.theme.bar.menus.border.radius, title: 'Border Radius', type: 'string' }),
                Option({ opt: options.theme.bar.menus.border.color, title: 'Border Color', type: 'color' }),
            ]
        })
    })
}
