import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, GtkWidget } from 'lib/types/widget';

export const CustomModuleTheme = (): Scrollable<GtkWidget, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page customModules paged-container',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('RAM'),
                Option({ opt: options.theme.bar.buttons.modules.ram.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.ram.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.ram.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.ram.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.ram.border, title: 'Border', type: 'color' }),

                Header('CPU'),
                Option({ opt: options.theme.bar.buttons.modules.cpu.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.cpu.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.cpu.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.cpu.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.cpu.border, title: 'Border', type: 'color' }),

                Header('Storage'),
                Option({ opt: options.theme.bar.buttons.modules.storage.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.storage.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.storage.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.storage.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.storage.border, title: 'Border', type: 'color' }),

                Header('Netstat'),
                Option({ opt: options.theme.bar.buttons.modules.netstat.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.netstat.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.netstat.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.netstat.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.netstat.border, title: 'Border', type: 'color' }),

                Header('Keyboard Layout'),
                Option({ opt: options.theme.bar.buttons.modules.kbLayout.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.kbLayout.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.kbLayout.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.kbLayout.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.kbLayout.border, title: 'Border', type: 'color' }),

                Header('Updates'),
                Option({ opt: options.theme.bar.buttons.modules.updates.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.updates.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.updates.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.updates.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.updates.border, title: 'Border', type: 'color' }),

                Header('Submap'),
                Option({ opt: options.theme.bar.buttons.modules.submap.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.submap.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.submap.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.submap.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.submap.border, title: 'Border', type: 'color' }),

                Header('Weather'),
                Option({ opt: options.theme.bar.buttons.modules.weather.icon, title: 'Icon', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.weather.text, title: 'Text', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.weather.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.weather.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.weather.border, title: 'Border', type: 'color' }),

                Header('Power'),
                Option({ opt: options.theme.bar.buttons.modules.power.icon, title: 'Icon', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.power.background,
                    title: 'Label Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.buttons.modules.power.icon_background,
                    title: 'Icon Background',
                    subtitle:
                        "Applies a background color to the icon section of the button.\nRequires 'split' button styling.",
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.buttons.modules.power.border, title: 'Border', type: 'color' }),
            ],
        }),
    });
};
