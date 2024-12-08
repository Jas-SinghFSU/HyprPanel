import { execAsync } from 'astal';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { bluetoothService } from 'src/lib/constants/services';

export const getAvailableBluetoothDevices = (): AstalBluetooth.Device[] => {
    const availableDevices = bluetoothService.devices
        .filter((btDev) => btDev.name !== null)
        .sort((a, b) => {
            if (a.connected || a.paired) {
                return -1;
            }

            if (b.connected || b.paired) {
                return 1;
            }

            return a.name.localeCompare(b.name);
        });

    return availableDevices;
};

export const getConnectedBluetoothDevices = (): string[] => {
    const availableDevices = getAvailableBluetoothDevices();
    const connectedDeviceNames = availableDevices.filter((d) => d.connected || d.paired).map((d) => d.address);

    return connectedDeviceNames;
};

export const forgetBluetoothDevice = (device: AstalBluetooth.Device): void => {
    execAsync(['bash', '-c', `bluetoothctl remove ${device.address}`])
        .catch((err) => console.error('Bluetooth Remove', err))
        .then(() => {
            bluetoothService.emit('device-removed', device);
        });
};
