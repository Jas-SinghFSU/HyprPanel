import { Gtk } from 'astal/gtk3';
import { DeviceControls } from './DeviceControls.js';
import Variable from 'astal/variable.js';
import { bind } from 'astal/binding.js';
import { bluetoothService } from 'src/lib/constants/services.js';
import { getAvailableBluetoothDevices, getConnectedBluetoothDevices } from './helpers.js';
import { BluetoothDevice } from './Device.js';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

export const BluetoothDevices = (): JSX.Element => {
    const BluetoothDisabled = (): JSX.Element => {
        return (
            <box className={'bluetooth-items'} vertical expand valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
                <label className={'bluetooth-disabled dim'} hexpand label={'Bluetooth is disabled'} />
            </box>
        );
    };

    const NoBluetoothDevices = (): JSX.Element => {
        return (
            <box className={'bluetooth-items'} vertical expand valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
                <label className={'no-bluetooth-devices dim'} hexpand label={'No devices currently found'} />
                <label className={'search-bluetooth-label dim'} hexpand label={"Press '󰑐' to search"} />
            </box>
        );
    };

    const DeviceListItem = ({ btDevice, connectedDevices }: DeviceListItemProps): JSX.Element => {
        return (
            <box>
                <BluetoothDevice device={btDevice} connectedDevices={connectedDevices} />
                <DeviceControls device={btDevice} connectedDevices={connectedDevices} />
            </box>
        );
    };

    return (
        <box className={'menu-items-section'}>
            <box className={'menu-content'} vertical>
                {Variable.derive([bind(bluetoothService, 'devices'), bind(bluetoothService, 'isPowered')], () => {
                    const availableDevices = getAvailableBluetoothDevices();
                    const connectedDevices = getConnectedBluetoothDevices();

                    if (availableDevices.length === 0) {
                        return <NoBluetoothDevices />;
                    }

                    if (!bluetoothService.adapter.powered) {
                        return <BluetoothDisabled />;
                    }

                    return availableDevices.map((btDevice) => {
                        return <DeviceListItem btDevice={btDevice} connectedDevices={connectedDevices} />;
                    });
                })()}
            </box>
        </box>
    );
};

interface DeviceListItemProps {
    btDevice: AstalBluetooth.Device;
    connectedDevices: string[];
}
