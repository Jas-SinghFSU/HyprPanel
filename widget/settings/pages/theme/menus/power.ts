import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const PowerMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page power paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.power.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.power.border.color, title: 'Border', type: 'color' }),

                Header('Shutdown Button'),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.shutdown.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.shutdown.icon_background,
                    title: 'Icon Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.shutdown.text,
                    title: 'Label Text',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.power.buttons.shutdown.icon, title: 'Icon', type: 'color' }),

                Header('Reboot Button'),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.restart.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.restart.icon_background,
                    title: 'Icon Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.restart.text,
                    title: 'Label Text',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.power.buttons.restart.icon, title: 'Icon', type: 'color' }),

                Header('Logout Button'),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.logout.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.logout.icon_background,
                    title: 'Icon Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.logout.text,
                    title: 'Label Text',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.power.buttons.logout.icon, title: 'Icon', type: 'color' }),

                Header('Sleep Button'),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.sleep.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.sleep.icon_background,
                    title: 'Icon Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.power.buttons.sleep.text,
                    title: 'Label Text',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.power.buttons.sleep.icon, title: 'Icon', type: 'color' }),
            ],
        }),
    });
};
