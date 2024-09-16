const audio = await Service.import('audio');
import { BoxWidget } from 'lib/types/widget.js';
import { renderInputDevices } from './InputDevices.js';
import { renderPlaybacks } from './PlaybackDevices.js';

const availableDevices = (): BoxWidget => {
    return Widget.Box({
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-section-container playback',
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'menu-label-container playback',
                        hpack: 'fill',
                        child: Widget.Label({
                            class_name: 'menu-label audio playback',
                            hexpand: true,
                            hpack: 'start',
                            label: 'Playback Devices',
                        }),
                    }),
                    Widget.Box({
                        class_name: 'menu-items-section playback',
                        vertical: true,
                        children: [
                            Widget.Box({
                                class_name: 'menu-container playback',
                                vertical: true,
                                children: [
                                    Widget.Box({
                                        vertical: true,
                                        children: audio.bind('speakers').as((v) => renderPlaybacks(v)),
                                    }),
                                ],
                            }),
                        ],
                    }),
                    Widget.Box({
                        class_name: 'menu-label-container input',
                        hpack: 'fill',
                        child: Widget.Label({
                            class_name: 'menu-label audio input',
                            hexpand: true,
                            hpack: 'start',
                            label: 'Input Devices',
                        }),
                    }),
                    Widget.Box({
                        class_name: 'menu-items-section input',
                        vertical: true,
                        children: [
                            Widget.Box({
                                class_name: 'menu-container input',
                                vertical: true,
                                children: [
                                    Widget.Box({
                                        vertical: true,
                                        children: audio.bind('microphones').as((v) => renderInputDevices(v)),
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};

export { availableDevices };
