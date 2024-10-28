import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const MediaMenuTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page media paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Media Menu Theme Settings'),
                Option({ opt: options.theme.bar.menus.menu.media.song, title: 'Song', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.media.artist, title: 'Artist', type: 'color' }),
                Option({ opt: options.theme.bar.menus.menu.media.album, title: 'Album', type: 'color' }),

                Header('Background'),
                Option({
                    opt: options.theme.bar.menus.menu.media.background.color,
                    title: 'Background',
                    type: 'color',
                }),

                Header('Border'),
                Option({ opt: options.theme.bar.menus.menu.media.border.color, title: 'Border', type: 'color' }),

                Header('Card/Album Art'),
                Option({ opt: options.theme.bar.menus.menu.media.card.color, title: 'Color', type: 'color' }),
                Option({
                    opt: options.theme.bar.menus.menu.media.card.tint,
                    title: 'Tint',
                    type: 'number',
                    increment: 5,
                    min: 0,
                    max: 100,
                }),

                Header('Buttons'),
                Option({
                    opt: options.theme.bar.menus.menu.media.buttons.inactive,
                    title: 'Unavailable',
                    subtitle: "Disabled button when media control isn't available.",
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.media.buttons.enabled,
                    title: 'Enabled',
                    subtitle: 'Ex: Button color when shuffle/loop is enabled.',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.media.buttons.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.media.buttons.text, title: 'Text', type: 'color' }),

                Header('Slider'),
                Option({
                    opt: options.theme.bar.menus.menu.media.slider.primary,
                    title: 'Primary Color',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.media.slider.background,
                    title: 'Background',
                    type: 'color',
                }),
                Option({
                    opt: options.theme.bar.menus.menu.media.slider.backgroundhover,
                    title: 'Background (Hover)',
                    type: 'color',
                }),
                Option({ opt: options.theme.bar.menus.menu.media.slider.puck, title: 'Puck', type: 'color' }),
            ],
        }),
    });
};
