const network = await Service.import('network');
import { renderWAPs } from './WirelessAPs.js';
import { renderWapStaging } from './APStaging.js';
import { AccessPoint } from 'lib/types/network.js';
import { BoxWidget } from 'lib/types/widget.js';

const Staging = Variable({} as AccessPoint);
const Connecting = Variable('');

const searchInProgress = Variable(false);

const startRotation = (): void => {
    searchInProgress.value = true;
    setTimeout(() => {
        searchInProgress.value = false;
    }, 5 * 1000);
};

const Wifi = (): BoxWidget => {
    return Widget.Box({
        class_name: 'menu-section-container wifi',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-label-container',
                hpack: 'fill',
                children: [
                    Widget.Label({
                        class_name: 'menu-label',
                        hexpand: true,
                        hpack: 'start',
                        label: 'Wi-Fi',
                    }),
                    Widget.Switch({
                        class_name: 'menu-switch network',
                        vpack: 'center',
                        tooltip_text: 'Toggle Wifi',
                        active: network.wifi.enabled,
                        on_activate: () => {
                            network.toggleWifi();
                        },
                    }),
                    Widget.Button({
                        vpack: 'center',
                        hpack: 'end',
                        class_name: 'menu-icon-button search network',
                        on_primary_click: () => {
                            startRotation();
                            network.wifi.scan();
                        },
                        child: Widget.Icon({
                            class_name: searchInProgress.bind('value').as((v) => (v ? 'spinning' : '')),
                            icon: 'view-refresh-symbolic',
                        }),
                    }),
                ],
            }),
            Widget.Box({
                class_name: 'menu-items-section',
                vertical: true,
                children: [
                    Widget.Box({
                        class_name: 'wap-staging',
                        setup: (self) => {
                            renderWapStaging(self, network, Staging, Connecting);
                        },
                    }),
                    Widget.Box({
                        class_name: 'available-waps',
                        vertical: true,
                        setup: (self) => {
                            renderWAPs(self, network, Staging, Connecting);
                        },
                    }),
                ],
            }),
        ],
    });
};

export { Wifi };
