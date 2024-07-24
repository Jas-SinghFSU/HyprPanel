import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const MenuTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "never",
        class_name: "menu-theme-page paged-container",
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

                Header('List Items'),
                Option({ opt: options.theme.bar.menus.listitems.active, title: 'Active', subtitle: 'Items of a list (network name, bluetooth device name, playback device, etc.) when active or hovered.', type: 'color' }),
                Option({ opt: options.theme.bar.menus.listitems.passive, title: 'Passive', type: 'color' }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.icons.passive, title: 'Passive', type: 'color' }),

                Header('Switch'),
                Option({ opt: options.theme.bar.menus.switch.enabled, title: 'Enabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.switch.disabled, title: 'Disabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.switch.puck, title: 'Puck', type: 'color' }),

                Header('Buttons'),
                Option({ opt: options.theme.bar.menus.buttons.default, title: 'Primary', type: 'color' }),
                Option({ opt: options.theme.bar.menus.buttons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.buttons.disabled, title: 'Disabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.buttons.text, title: 'Text', type: 'color' }),

                Header('Icon Buttons'),
                Option({ opt: options.theme.bar.menus.iconbuttons.passive, title: 'Primary', type: 'color' }),
                Option({ opt: options.theme.bar.menus.iconbuttons.active, title: 'Active/Hovered', type: 'color' }),

                Header('Progress Bar'),
                Option({ opt: options.theme.bar.menus.progressbar.foreground, title: 'Primary', type: 'color' }),
                Option({ opt: options.theme.bar.menus.progressbar.background, title: 'Background', type: 'color' }),

                Header('Slider'),
                Option({ opt: options.theme.bar.menus.slider.primary, title: 'Primary', type: 'color' }),
                Option({ opt: options.theme.bar.menus.slider.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.slider.backgroundhover, title: 'Background (Hover)', type: 'color' }),
                Option({ opt: options.theme.bar.menus.slider.puck, title: 'Puck', type: 'color' }),

                Header('Dropdown Menu'),
                Option({ opt: options.theme.bar.menus.dropdownmenu.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.dropdownmenu.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.dropdownmenu.divider, title: 'Divider', type: 'color' }),

                Header('Tooltips'),
                Option({ opt: options.theme.bar.menus.tooltip.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.tooltip.text, title: 'Text', type: 'color' }),

            ]
        })
    })
}
