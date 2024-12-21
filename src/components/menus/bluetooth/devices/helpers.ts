import { execAsync } from 'astal';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { bluetoothService } from 'src/lib/constants/services';

/**
 * Retrieves the list of available Bluetooth devices.
 *
 * This function filters and sorts the list of Bluetooth devices from the `bluetoothService`.
 * It excludes devices with a null name and sorts the devices based on their connection and pairing status.
 *
 * @returns An array of available Bluetooth devices.
 */
export const getAvailableBluetoothDevices = (): AstalBluetooth.Device[] => {
    const bluetoothDevices = bluetoothService.get_devices() ?? [];

    const availableDevices = bluetoothDevices
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

/**
 * Retrieves the list of connected Bluetooth devices.
 *
 * This function filters the list of available Bluetooth devices to include only those that are connected or paired.
 * It returns an array of the addresses of the connected devices.
 *
 * @returns An array of addresses of connected Bluetooth devices.
 */
export const getConnectedBluetoothDevices = (): string[] => {
    const availableDevices = getAvailableBluetoothDevices();
    const connectedDeviceNames = availableDevices.filter((d) => d.connected || d.paired).map((d) => d.address);

    return connectedDeviceNames;
};

/**
 * Forgets a Bluetooth device.
 *
 * This function removes a Bluetooth device using the `bluetoothctl` command.
 * It executes the command asynchronously and emits a 'device-removed' event if the command is successful.
 *
 * @param device The Bluetooth device to forget.
 */
export const forgetBluetoothDevice = (device: AstalBluetooth.Device): void => {
    execAsync(['bash', '-c', `bluetoothctl remove ${device.address}`])
        .catch((err) => console.error('Bluetooth Remove', err))
        .then(() => {
            bluetoothService.emit('device-removed', device);
        });
};
