import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const BluetoothMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page bluetooth paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Bluetooth Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.text, title: 'Text', type: 'color' }),

                Header('Card'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.card.color, title: 'Card', type: 'color' }),

                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.border.color, title: 'Border', type: 'color' }),

                Header('Label'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.label.color, title: 'Label', type: 'color' }),

                Header('Status'),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.status,
                    title: 'Connection Status',
                    type: 'color',
                }),

                Header('List Items'),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.listitems.active,
                    title: 'Active/Hover',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.listitems.passive,
                    title: 'Passive',
                    type: 'color',
                }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.icons.passive, title: 'Passive', type: 'color' }),

                Header('Icon Buttons'),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.iconbutton.active,
                    title: 'Active',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.iconbutton.passive,
                    title: 'Passive',
                    type: 'color',
                }),

                Header('Switch'),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.switch.enabled, title: 'Enabled', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.switch.disabled,
                    title: 'Disabled',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.bluetooth.switch.puck, title: 'Puck', type: 'color' }),

                Header('Switch Divider'),
                Option({
                    opt: options.theme.bar.menus.menu.bluetooth.switch_divider,
                    title: 'Switch Divider',
                    type: 'color',
                }),
            ],
        }),
    });
};
