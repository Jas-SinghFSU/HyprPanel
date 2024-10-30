import { Bluetooth, BluetoothDevice } from 'types/service/bluetooth.js';
import Box from 'types/widgets/box.js';
import { connectedControls } from './connectedControls.js';
import { getBluetoothIcon } from '../utils.js';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options';
import Label from 'types/widgets/label.js';

const { showBattery, batteryIcon, batteryState } = options.menus.bluetooth;

const devices = (bluetooth: Bluetooth, self: Box<Gtk.Widget, unknown>): Box<Child, Attribute> => {
    return self.hook(bluetooth, () => {
        if (!bluetooth.enabled) {
            return (self.child = Widget.Box({
                class_name: 'bluetooth-items',
                vertical: true,
                expand: true,
                vpack: 'center',
                hpack: 'center',
                children: [
                    Widget.Label({
                        class_name: 'bluetooth-disabled dim',
                        hexpand: true,
                        label: 'Bluetooth is disabled',
                    }),
                ],
            }));
        }

        const availableDevices = bluetooth.devices
            .filter((btDev) => btDev.name !== null)
            .sort((a, b) => {
                if (a.connected || a.paired) {
                    return -1;
                }

                if (b.connected || b.paired) {
                    return 1;
                }

                return b.name - a.name;
            });

        const conDevNames = availableDevices.filter((d) => d.connected || d.paired).map((d) => d.address);

        if (!availableDevices.length) {
            return (self.child = Widget.Box({
                class_name: 'bluetooth-items',
                vertical: true,
                expand: true,
                vpack: 'center',
                hpack: 'center',
                children: [
                    Widget.Label({
                        class_name: 'no-bluetooth-devices dim',
                        hexpand: true,
                        label: 'No devices currently found',
                    }),
                    Widget.Label({
                        class_name: 'search-bluetooth-label dim',
                        hexpand: true,
                        label: "Press '󰑐' to search",
                    }),
                ],
            }));
        }

        const getConnectionStatusLabel = (device: BluetoothDevice): Label<Attribute> => {
            return Widget.Label({
                hpack: 'start',
                class_name: 'connection-status dim',
                label: device.connected ? 'Connected' : 'Paired',
            });
        };

        const getBatteryInfo = (device: BluetoothDevice, batIcon: string): Gtk.Widget[] => {
            if (typeof device.battery_percentage === 'number' && device.battery_percentage >= 0) {
                return [
                    Widget.Separator({
                        class_name: 'menu-separator bluetooth-battery',
                    }),
                    Widget.Label({
                        class_name: 'connection-status txt-icon',
                        label: `${batIcon}`,
                    }),
                    Widget.Label({
                        class_name: 'connection-status battery',
                        label: `${device.battery_percentage}%`,
                    }),
                ];
            }
            return [];
        };

        return (self.child = Widget.Box({
            vertical: true,
            children: availableDevices.map((device) => {
                return Widget.Box({
                    children: [
                        Widget.Button({
                            hexpand: true,
                            class_name: `bluetooth-element-item ${device}`,
                            on_primary_click: () => {
                                if (!conDevNames.includes(device.address)) device.setConnection(true);
                            },
                            child: Widget.Box({
                                hexpand: true,
                                children: [
                                    Widget.Box({
                                        hexpand: true,
                                        hpack: 'start',
                                        class_name: 'menu-button-container',
                                        children: [
                                            Widget.Label({
                                                vpack: 'start',
                                                class_name: `menu-button-icon bluetooth ${conDevNames.includes(device.address) ? 'active' : ''} txt-icon`,
                                                label: getBluetoothIcon(`${device['icon_name']}-symbolic`),
                                            }),
                                            Widget.Box({
                                                vertical: true,
                                                vpack: 'center',
                                                children: [
                                                    Widget.Label({
                                                        vpack: 'center',
                                                        hpack: 'start',
                                                        class_name: 'menu-button-name bluetooth',
                                                        truncate: 'end',
                                                        wrap: true,
                                                        label: device.alias,
                                                    }),
                                                    Widget.Revealer({
                                                        hpack: 'start',
                                                        reveal_child: device.connected || device.paired,
                                                        child: Widget.Box({
                                                            hpack: 'start',
                                                            children: Utils.merge(
                                                                [
                                                                    showBattery.bind('value'),
                                                                    batteryIcon.bind('value'),
                                                                    batteryState.bind('value'),
                                                                ],
                                                                (showBat, batIcon, batState) => {
                                                                    if (
                                                                        !showBat ||
                                                                        (batState === 'paired' && !device.paired) ||
                                                                        (batState === 'connected' && !device.connected)
                                                                    ) {
                                                                        return [getConnectionStatusLabel(device)];
                                                                    }

                                                                    return [
                                                                        getConnectionStatusLabel(device),
                                                                        Widget.Box({
                                                                            children: getBatteryInfo(device, batIcon),
                                                                        }),
                                                                    ];
                                                                },
                                                            ),
                                                        }),
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    Widget.Box({
                                        hpack: 'end',
                                        children: device.connecting
                                            ? [
                                                  Widget.Spinner({
                                                      vpack: 'start',
                                                      class_name: 'spinner bluetooth',
                                                  }),
                                              ]
                                            : [],
                                    }),
                                ],
                            }),
                        }),
                        connectedControls(device, conDevNames),
                    ],
                });
            }),
        }));
    });
};

export { devices };
