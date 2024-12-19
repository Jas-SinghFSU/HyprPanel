import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { getBluetoothIcon } from '../../utils';

export const DeviceIcon = ({ device, connectedDevices }: DeviceIconProps): JSX.Element => {
    return (
        <label
            valign={Gtk.Align.START}
            className={bind(device, 'address').as(
                (address) =>
                    `menu-button-icon bluetooth ${connectedDevices.includes(address) ? 'active' : ''} txt-icon`,
            )}
            label={bind(device, 'icon').as((icon) => getBluetoothIcon(`${icon}-symbolic`))}
        />
    );
};

interface DeviceIconProps {
    device: AstalBluetooth.Device;
    connectedDevices: string[];
}
