import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const MenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('General'),
                Option({
                    opt: options.dummy,
                    title: 'Theme',
                    subtitle: 'WARNING: Importing a theme will replace your current theme color settings.',
                    type: 'config_import',
                    exportData: {
                        filePath: OPTIONS,
                        themeOnly: true,
                    },
                }),
                Option({
                    opt: options.theme.bar.menus.monochrome,
                    title: 'Use Global Colors',
                    type: 'boolean',
                    disabledBinding: options.theme.matugen,
                }),
                Option({
                    opt: options.wallpaper.pywal,
                    title: 'Generate Pywal Colors',
                    subtitle: 'Whether to also generate pywal colors with chosen wallpaper',
                    type: 'boolean',
                }),
                Option({
                    opt: options.wallpaper.enable,
                    title: 'Apply Wallpapers',
                    subtitle: 'Whether to apply the wallpaper or to only use it for Matugen color generation.',
                    type: 'boolean',
                }),
                Option({
                    opt: options.wallpaper.image,
                    title: 'Wallpaper',
                    subtitle: options.wallpaper.image.bind('value'),
                    type: 'wallpaper',
                }),
                Option({ opt: options.theme.bar.menus.background, title: 'Background Color', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.opacity,
                    title: 'Menu Opacity',
                    type: 'number',
                    increment: 5,
                    min: 0,
                    max: 100,
                }),
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

                Header('Popover'),
                Option({ opt: options.theme.bar.menus.popover.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.popover.background, title: 'Background', type: 'color' }),

                Header('List Items'),
                Option({
                    opt: options.theme.bar.menus.listitems.active,
                    title: 'Active',
                    subtitle:
                        'Items of a list (network name, bluetooth device name, playback device, etc.) when active or hovered.',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.listitems.passive, title: 'Passive', type: 'color' }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.icons.passive, title: 'Passive', type: 'color' }),

                Header('Switch'),
                Option({ opt: options.theme.bar.menus.switch.enabled, title: 'Enabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.switch.disabled, title: 'Disabled', type: 'color' }),
                Option({ opt: options.theme.bar.menus.switch.radius, title: 'Switch Radius', type: 'string' }),
                Option({
                    opt: options.theme.bar.menus.switch.slider_radius,
                    title: 'Switch Puck Radius',
                    type: 'string',
                }),
                Option({ opt: options.theme.bar.menus.switch.puck, title: 'Puck', type: 'color' }),

                Header('Check/Radio Buttons'),
                Option({
                    opt: options.theme.bar.menus.check_radio_button.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.check_radio_button.active, title: 'Active', type: 'color' }),

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
                Option({
                    opt: options.theme.bar.menus.slider.backgroundhover,
                    title: 'Background (Hover)',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.slider.slider_radius,
                    title: 'Slider Puck Radius',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.bar.menus.slider.progress_radius,
                    title: 'Slider/Progress Bar Radius',
                    type: 'string',
                }),
                Option({ opt: options.theme.bar.menus.slider.puck, title: 'Puck', type: 'color' }),

                Header('Dropdown Menu'),
                Option({ opt: options.theme.bar.menus.dropdownmenu.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.dropdownmenu.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.menus.dropdownmenu.divider, title: 'Divider', type: 'color' }),

                Header('Tooltips'),
                Option({ opt: options.theme.bar.menus.tooltip.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.menus.tooltip.text, title: 'Text', type: 'color' }),
            ],
        }),
    });
};
