import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { DeviceControls } from './controls';
import { BluetoothDevice } from './device';

export const DeviceListItem = ({ btDevice, connectedDevices }: DeviceListItemProps): JSX.Element => {
    return (
        <box>
            <BluetoothDevice device={btDevice} connectedDevices={connectedDevices} />
            <DeviceControls device={btDevice} connectedDevices={connectedDevices} />
        </box>
    );
};

interface DeviceListItemProps {
    btDevice: AstalBluetooth.Device;
    connectedDevices: string[];
}
