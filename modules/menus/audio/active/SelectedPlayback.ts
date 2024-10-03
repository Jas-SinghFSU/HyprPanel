const audio = await Service.import('audio');
import { getIcon } from '../utils.js';
import Box from 'types/widgets/box.js';
import { Attribute, Child } from 'lib/types/widget.js';

const renderActivePlayback = (): Box<Child, Attribute>[] => {
    return [
        Widget.Box({
            class_name: 'menu-slider-container playback',
            children: [
                Widget.Button({
                    vexpand: false,
                    vpack: 'end',
                    setup: (self) => {
                        const updateClass = (): void => {
                            const spkr = audio.speaker;
                            const className = `menu-active-button playback ${spkr.is_muted ? 'muted' : ''}`;
                            self.class_name = className;
                        };

                        self.hook(audio.speaker, updateClass, 'notify::is-muted');
                    },
                    on_primary_click: () => (audio.speaker.is_muted = !audio.speaker.is_muted),
                    child: Widget.Icon({
                        class_name: 'menu-active-icon playback',
                        setup: (self) => {
                            const updateIcon = (): void => {
                                const isSpeakerMuted = audio.speaker.is_muted !== null ? audio.speaker.is_muted : true;
                                self.icon = getIcon(audio.speaker.volume, isSpeakerMuted)['spkr'];
                            };
                            self.hook(audio.speaker, updateIcon, 'notify::volume');
                            self.hook(audio.speaker, updateIcon, 'notify::is-muted');
                        },
                    }),
                }),
                Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            class_name: 'menu-active playback',
                            hpack: 'start',
                            truncate: 'end',
                            expand: true,
                            wrap: true,
                            label: audio.bind('speaker').as((v) => v.description || ''),
                        }),
                        Widget.Slider({
                            value: audio['speaker'].bind('volume'),
                            class_name: 'menu-active-slider menu-slider playback',
                            draw_value: false,
                            hexpand: true,
                            min: 0,
                            max: 1,
                            onChange: ({ value }) => (audio.speaker.volume = value),
                        }),
                    ],
                }),
                Widget.Label({
                    vpack: 'end',
                    class_name: 'menu-active-percentage playback',
                    label: audio.speaker.bind('volume').as((v) => `${Math.round(v * 100)}%`),
                }),
            ],
        }),
    ];
};

export { renderActivePlayback };
