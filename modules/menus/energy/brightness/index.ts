import { BoxWidget } from 'lib/types/widget.js';
import brightness from '../../../../services/Brightness.js';
import icons from '../../../icons/index.js';

const Brightness = (): BoxWidget => {
    return Widget.Box({
        class_name: 'menu-section-container brightness',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-label-container',
                hpack: 'fill',
                child: Widget.Label({
                    class_name: 'menu-label',
                    hexpand: true,
                    hpack: 'start',
                    label: 'Brightness',
                }),
            }),
            Widget.Box({
                class_name: 'menu-items-section',
                vpack: 'fill',
                vexpand: true,
                vertical: true,
                child: Widget.Box({
                    class_name: 'brightness-container',
                    children: [
                        Widget.Icon({
                            vexpand: true,
                            vpack: 'center',
                            class_name: 'brightness-slider-icon',
                            icon: icons.brightness.screen,
                        }),
                        Widget.Slider({
                            vpack: 'center',
                            vexpand: true,
                            value: brightness.bind('screen'),
                            class_name: 'menu-active-slider menu-slider brightness',
                            draw_value: false,
                            hexpand: true,
                            min: 0,
                            max: 1,
                            onChange: ({ value }) => (brightness.screen = value),
                        }),
                        Widget.Label({
                            vpack: 'center',
                            vexpand: true,
                            class_name: 'brightness-slider-label',
                            label: brightness.bind('screen').as((b) => `${Math.round(b * 100)}%`),
                        }),
                    ],
                }),
            }),
        ],
    });
};

export { Brightness };
