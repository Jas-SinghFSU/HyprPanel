import { BoxWidget } from 'lib/types/widget';

const network = await Service.import('network');
const bluetooth = await Service.import('bluetooth');
const notifications = await Service.import('notifications');
const audio = await Service.import('audio');

const Controls = (): BoxWidget => {
    return Widget.Box({
        class_name: 'dashboard-card controls-container',
        hpack: 'fill',
        vpack: 'fill',
        expand: true,
        children: [
            Widget.Button({
                tooltip_text: 'Toggle Wifi',
                expand: true,
                setup: (self) => {
                    self.hook(network, () => {
                        return (self.class_name = `dashboard-button wifi ${!network.wifi.enabled ? 'disabled' : ''}`);
                    });
                },
                on_primary_click: () => network.toggleWifi(),
                child: Widget.Label({
                    class_name: 'txt-icon',
                    setup: (self) => {
                        self.hook(network, () => {
                            return (self.label = network.wifi.enabled ? '󰤨' : '󰤭');
                        });
                    },
                }),
            }),
            Widget.Button({
                tooltip_text: 'Toggle Bluetooth',
                expand: true,
                class_name: bluetooth
                    .bind('enabled')
                    .as((btOn) => `dashboard-button bluetooth ${!btOn ? 'disabled' : ''}`),
                on_primary_click: () => bluetooth.toggle(),
                child: Widget.Label({
                    class_name: 'txt-icon',
                    label: bluetooth.bind('enabled').as((btOn) => (btOn ? '󰂯' : '󰂲')),
                }),
            }),
            Widget.Button({
                tooltip_text: 'Toggle Notifications',
                expand: true,
                class_name: notifications
                    .bind('dnd')
                    .as((dnd) => `dashboard-button notifications ${dnd ? 'disabled' : ''}`),
                on_primary_click: () => (notifications.dnd = !notifications.dnd),
                child: Widget.Label({
                    class_name: 'txt-icon',
                    label: notifications.bind('dnd').as((dnd) => (dnd ? '󰂛' : '󰂚')),
                }),
            }),
            Widget.Button({
                tooltip_text: 'Toggle Mute (Playback)',
                expand: true,
                on_primary_click: () => (audio.speaker.is_muted = !audio.speaker.is_muted),
                setup: (self) => {
                    self.hook(
                        audio.speaker,
                        () => {
                            return (self.class_name = `dashboard-button playback ${audio.speaker.is_muted ? 'disabled' : ''}`);
                        },
                        'notify::is-muted',
                    );
                },
                child: Widget.Label({
                    class_name: 'txt-icon',
                    setup: (self) => {
                        self.hook(
                            audio.speaker,
                            () => {
                                return (self.label = audio.speaker.is_muted ? '󰖁' : '󰕾');
                            },
                            'notify::is-muted',
                        );
                    },
                }),
            }),
            Widget.Button({
                tooltip_text: 'Toggle Mute (Microphone)',
                expand: true,
                on_primary_click: () => (audio.microphone.is_muted = !audio.microphone.is_muted),
                setup: (self) => {
                    self.hook(
                        audio.microphone,
                        () => {
                            return (self.class_name = `dashboard-button input ${audio.microphone.is_muted ? 'disabled' : ''}`);
                        },
                        'notify::is-muted',
                    );
                },
                child: Widget.Label({
                    class_name: 'txt-icon',
                    setup: (self) => {
                        self.hook(
                            audio.microphone,
                            () => {
                                return (self.label = audio.microphone.is_muted ? '󰍭' : '󰍬');
                            },
                            'notify::is-muted',
                        );
                    },
                }),
            }),
        ],
    });
};

export { Controls };
