import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const SystrayMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page systray paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Dropdown Menu'),
                Option({
                    opt: options.theme.bar.menus.menu.systray.dropdownmenu.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.systray.dropdownmenu.text, title: 'Text', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.systray.dropdownmenu.divider,
                    title: 'Section Divider',
                    type: 'color',
                }),
            ],
        }),
    });
};
