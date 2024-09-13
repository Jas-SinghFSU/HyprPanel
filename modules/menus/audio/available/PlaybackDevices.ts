const audio = await Service.import('audio');
import { PlaybackDevices } from 'lib/types/audio';
import { Stream } from 'types/service/audio';

const renderPlaybacks = (playbackDevices: Stream[]): PlaybackDevices => {
    return playbackDevices.map((device) => {
        if (device.description === 'Dummy Output') {
            return Widget.Box({
                class_name: 'menu-unfound-button playback',
                child: Widget.Box({
                    children: [
                        Widget.Label({
                            class_name: 'menu-button-name playback',
                            label: 'No playback devices found...',
                        }),
                    ],
                }),
            });
        }
        return Widget.Button({
            class_name: `menu-button audio playback ${device}`,
            on_primary_click: () => (audio.speaker = device),
            child: Widget.Box({
                children: [
                    Widget.Box({
                        hpack: 'start',
                        children: [
                            Widget.Label({
                                truncate: 'end',
                                wrap: true,
                                class_name: audio.speaker
                                    .bind('description')
                                    .as((v) =>
                                        device.description === v
                                            ? 'menu-button-icon active playback txt-icon'
                                            : 'menu-button-icon playback txt-icon',
                                    ),
                                label: '',
                            }),
                            Widget.Label({
                                truncate: 'end',
                                wrap: true,
                                class_name: audio.speaker
                                    .bind('description')
                                    .as((v) =>
                                        device.description === v
                                            ? 'menu-button-name active playback'
                                            : 'menu-button-name playback',
                                    ),
                                label: device.description,
                            }),
                        ],
                    }),
                ],
            }),
        });
    });
};

export { renderPlaybacks };
