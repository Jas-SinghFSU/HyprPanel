const audio = await Service.import('audio');
import { getIcon } from '../utils.js';
import Box from 'types/widgets/box.js';
import { Attribute, Child } from 'lib/types/widget.js';

const renderActiveInput = (): Box<Child, Attribute>[] => {
    return [
        Widget.Box({
            class_name: 'menu-slider-container input',
            children: [
                Widget.Button({
                    vexpand: false,
                    vpack: 'end',
                    setup: (self) => {
                        const updateClass = (): void => {
                            const mic = audio.microphone;
                            const className = `menu-active-button input ${mic.is_muted ? 'muted' : ''}`;
                            self.class_name = className;
                        };

                        self.hook(audio.microphone, updateClass, 'notify::is-muted');
                    },
                    on_primary_click: () => (audio.microphone.is_muted = !audio.microphone.is_muted),
                    child: Widget.Icon({
                        class_name: 'menu-active-icon input',
                        setup: (self) => {
                            const updateIcon = (): void => {
                                const isMicMuted =
                                    audio.microphone.is_muted !== null ? audio.microphone.is_muted : true;

                                if (audio.microphone.volume > 0) {
                                    self.icon = getIcon(audio.microphone.volume, isMicMuted)['mic'];
                                } else {
                                    self.icon = getIcon(100, true)['mic'];
                                }
                            };
                            self.hook(audio.microphone, updateIcon, 'notify::volume');
                            self.hook(audio.microphone, updateIcon, 'notify::is-muted');
                        },
                    }),
                }),
                Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            class_name: 'menu-active input',
                            hpack: 'start',
                            truncate: 'end',
                            wrap: true,
                            label: audio.bind('microphone').as((v) => {
                                return v.description === null ? 'No input device found...' : v.description;
                            }),
                        }),
                        Widget.Slider({
                            value: audio.microphone.bind('volume').as((v) => v),
                            class_name: 'menu-active-slider menu-slider inputs',
                            draw_value: false,
                            hexpand: true,
                            min: 0,
                            max: 1,
                            onChange: ({ value }) => (audio.microphone.volume = value),
                        }),
                    ],
                }),
                Widget.Label({
                    class_name: 'menu-active-percentage input',
                    vpack: 'end',
                    label: audio.microphone.bind('volume').as((v) => `${Math.round(v * 100)}%`),
                }),
            ],
        }),
    ];
};

export { renderActiveInput };
