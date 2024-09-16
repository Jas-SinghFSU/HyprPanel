import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const BatteryMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page battery paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Battery Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.battery.text, title: 'Text', type: 'color' }),

                Header('Card'),
                Option({ opt: options.theme.bar.menus.menu.battery.card.color, title: 'Card', type: 'color' }),

                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.battery.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.battery.border.color, title: 'Border', type: 'color' }),

                Header('Label'),
                Option({ opt: options.theme.bar.menus.menu.battery.label.color, title: 'Label', type: 'color' }),

                Header('List Items'),
                Option({
                    opt: options.theme.bar.menus.menu.battery.listitems.active,
                    title: 'Active/Hover',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.battery.listitems.passive,
                    title: 'Passive',
                    type: 'color',
                }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.menu.battery.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.battery.icons.passive, title: 'Passive', type: 'color' }),

                Header('Slider'),
                Option({ opt: options.theme.bar.menus.menu.battery.slider.primary, title: 'Primary', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.battery.slider.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.battery.slider.backgroundhover,
                    title: 'Background (Hover)',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.battery.slider.puck, title: 'Puck', type: 'color' }),
            ],
        }),
    });
};
