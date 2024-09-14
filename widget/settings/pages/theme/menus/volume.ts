import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const VolumeMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page volume paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Volume Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.volume.text, title: 'Text', type: 'color' }),

                Header('Card'),
                Option({ opt: options.theme.bar.menus.menu.volume.card.color, title: 'Card', type: 'color' }),

                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.volume.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.volume.border.color, title: 'Border', type: 'color' }),

                Header('Label'),
                Option({ opt: options.theme.bar.menus.menu.volume.label.color, title: 'Label', type: 'color' }),

                Header('List Items'),
                Option({
                    opt: options.theme.bar.menus.menu.volume.listitems.active,
                    title: 'Active/Hover',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.volume.listitems.passive, title: 'Passive', type: 'color' }),

                Header('Icon Button'),
                Option({
                    opt: options.theme.bar.menus.menu.volume.iconbutton.active,
                    title: 'Active/Hover',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.volume.iconbutton.passive,
                    title: 'Passive',
                    type: 'color',
                }),

                Header('Icons'),
                Option({ opt: options.theme.bar.menus.menu.volume.icons.active, title: 'Active', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.volume.icons.passive, title: 'Passive', type: 'color' }),

                Header('Audio Slider'),
                Option({
                    opt: options.theme.bar.menus.menu.volume.audio_slider.primary,
                    title: 'Primary',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.volume.audio_slider.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.volume.audio_slider.backgroundhover,
                    title: 'Background (Hover)',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.volume.audio_slider.puck, title: 'Puck', type: 'color' }),

                Header('Input Slider'),
                Option({
                    opt: options.theme.bar.menus.menu.volume.input_slider.primary,
                    title: 'Primary',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.volume.input_slider.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.volume.input_slider.backgroundhover,
                    title: 'Background (Hover)',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.volume.input_slider.puck, title: 'Puck', type: 'color' }),
            ],
        }),
    });
};
