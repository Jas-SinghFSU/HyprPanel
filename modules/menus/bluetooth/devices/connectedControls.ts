import { BoxWidget } from 'lib/types/widget';
import { BluetoothDevice } from 'types/service/bluetooth';

const connectedControls = (dev: BluetoothDevice, connectedDevices: BluetoothDevice[]): BoxWidget => {
    if (!connectedDevices.includes(dev.address)) {
        return Widget.Box({});
    }

    return Widget.Box({
        vpack: 'start',
        class_name: 'bluetooth-controls',
        children: [
            Widget.Button({
                class_name: 'menu-icon-button unpair bluetooth',
                child: Widget.Label({
                    tooltip_text: dev.paired ? 'Unpair' : 'Pair',
                    class_name: 'menu-icon-button-label unpair bluetooth txt-icon',
                    label: dev.paired ? '' : '',
                }),
                on_primary_click: () =>
                    Utils.execAsync([
                        'bash',
                        '-c',
                        `bluetoothctl ${dev.paired ? 'unpair' : 'pair'} ${dev.address}`,
                    ]).catch((err) =>
                        console.error(`bluetoothctl ${dev.paired ? 'unpair' : 'pair'} ${dev.address}`, err),
                    ),
            }),
            Widget.Button({
                class_name: 'menu-icon-button disconnect bluetooth',
                child: Widget.Label({
                    tooltip_text: dev.connected ? 'Disconnect' : 'Connect',
                    class_name: 'menu-icon-button-label disconnect bluetooth txt-icon',
                    label: dev.connected ? '󱘖' : '',
                }),
                on_primary_click: () => dev.setConnection(!dev.connected),
            }),
            Widget.Button({
                class_name: 'menu-icon-button untrust bluetooth',
                child: Widget.Label({
                    tooltip_text: dev.trusted ? 'Untrust' : 'Trust',
                    class_name: 'menu-icon-button-label untrust bluetooth txt-icon',
                    label: dev.trusted ? '' : '󱖡',
                }),
                on_primary_click: () =>
                    Utils.execAsync([
                        'bash',
                        '-c',
                        `bluetoothctl ${dev.trusted ? 'untrust' : 'trust'} ${dev.address}`,
                    ]).catch((err) =>
                        console.error(`bluetoothctl ${dev.trusted ? 'untrust' : 'trust'} ${dev.address}`, err),
                    ),
            }),
            Widget.Button({
                class_name: 'menu-icon-button delete bluetooth',
                child: Widget.Label({
                    tooltip_text: 'Forget',
                    class_name: 'menu-icon-button-label delete bluetooth txt-icon',
                    label: '󰆴',
                }),
                on_primary_click: () => {
                    Utils.execAsync(['bash', '-c', `bluetoothctl remove ${dev.address}`]).catch((err) =>
                        console.error('Bluetooth Remove', err),
                    );
                },
            }),
        ],
    });
};

export { connectedControls };
