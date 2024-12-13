import Variable from 'astal/variable.js';
import { bind } from 'astal/binding.js';
import { bluetoothService } from 'src/lib/constants/services.js';
import { getAvailableBluetoothDevices, getConnectedBluetoothDevices } from './helpers.js';
import { NoBluetoothDevices } from './NoBluetoothDevices.js';
import { BluetoothDisabled } from './BluetoothDisabled.js';
import { DeviceListItem } from './DeviceListItem.js';

export const BluetoothDevices = (): JSX.Element => {
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
