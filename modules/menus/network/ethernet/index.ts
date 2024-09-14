import { BoxWidget } from 'lib/types/widget';

const network = await Service.import('network');

const Ethernet = (): BoxWidget => {
    return Widget.Box({
        class_name: 'menu-section-container ethernet',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-label-container',
                hpack: 'fill',
                child: Widget.Label({
                    class_name: 'menu-label',
                    hexpand: true,
                    hpack: 'start',
                    label: 'Ethernet',
                }),
            }),
            Widget.Box({
                class_name: 'menu-items-section',
                vertical: true,
                child: Widget.Box({
                    class_name: 'menu-content',
                    vertical: true,
                    setup: (self) => {
                        self.hook(network, () => {
                            return (self.child = Widget.Box({
                                class_name: 'network-element-item',
                                child: Widget.Box({
                                    hpack: 'start',
                                    children: [
                                        Widget.Icon({
                                            class_name: `network-icon ethernet ${network.wired.state === 'activated' ? 'active' : ''}`,
                                            tooltip_text: network.wired.internet,
                                            icon: `${network.wired['icon_name']}`,
                                        }),
                                        Widget.Box({
                                            class_name: 'connection-container',
                                            vertical: true,
                                            children: [
                                                Widget.Label({
                                                    class_name: 'active-connection',
                                                    hpack: 'start',
                                                    truncate: 'end',
                                                    wrap: true,
                                                    label: `Ethernet Connection ${network.wired.state !== 'unknown' && typeof network.wired?.speed === 'number' ? `(${network.wired?.speed / 1000} Gbps)` : ''}`,
                                                }),
                                                Widget.Label({
                                                    hpack: 'start',
                                                    class_name: 'connection-status dim',
                                                    label:
                                                        network.wired.internet.charAt(0).toUpperCase() +
                                                        network.wired.internet.slice(1),
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            }));
                        });
                    },
                }),
            }),
        ],
    });
};

export { Ethernet };
