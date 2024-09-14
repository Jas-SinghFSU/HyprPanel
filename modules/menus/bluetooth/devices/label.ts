import { BoxWidget } from 'lib/types/widget';
import { Bluetooth } from 'types/service/bluetooth';

const label = (bluetooth: Bluetooth): BoxWidget => {
    const searchInProgress = Variable(false);

    const startRotation = (): void => {
        searchInProgress.value = true;
        setTimeout(() => {
            searchInProgress.value = false;
        }, 10 * 1000);
    };

    return Widget.Box({
        class_name: 'menu-label-container',
        hpack: 'fill',
        vpack: 'start',
        children: [
            Widget.Label({
                class_name: 'menu-label',
                vpack: 'center',
                hpack: 'start',
                label: 'Bluetooth',
            }),
            Widget.Box({
                class_name: 'controls-container',
                vpack: 'start',
                children: [
                    Widget.Switch({
                        class_name: 'menu-switch bluetooth',
                        hexpand: true,
                        hpack: 'end',
                        active: bluetooth.bind('enabled'),
                        on_activate: ({ active }) => {
                            searchInProgress.value = false;
                            Utils.execAsync(['bash', '-c', `bluetoothctl power ${active ? 'on' : 'off'}`]).catch(
                                (err) => console.error(`bluetoothctl power ${active ? 'on' : 'off'}`, err),
                            );
                        },
                    }),
                    Widget.Separator({
                        class_name: 'menu-separator bluetooth',
                    }),
                    Widget.Button({
                        vpack: 'center',
                        class_name: 'menu-icon-button search',
                        on_primary_click: () => {
                            startRotation();
                            Utils.execAsync(['bash', '-c', 'bluetoothctl --timeout 120 scan on']).catch((err) => {
                                searchInProgress.value = false;
                                console.error('bluetoothctl --timeout 120 scan on', err);
                            });
                        },
                        child: Widget.Icon({
                            class_name: searchInProgress.bind('value').as((v) => (v ? 'spinning' : '')),
                            icon: 'view-refresh-symbolic',
                        }),
                    }),
                ],
            }),
        ],
    });
};

export { label };
