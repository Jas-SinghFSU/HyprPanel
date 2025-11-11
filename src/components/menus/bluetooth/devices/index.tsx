import { bind, Variable } from 'astal';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { SystemUtilities } from 'src/core/system/SystemUtilities.js';
import { BluetoothDisabled } from './BluetoothDisabled.js';
import { BluetoothUnavailable } from './BluetoothUnavailable.js';
import { DeviceListItem } from './DeviceListItem.js';
import { getAvailableBluetoothDevices, getConnectedBluetoothDevices } from './helpers.js';
import { NoBluetoothDevices } from './NoBluetoothDevices.js';

const bluetoothService = AstalBluetooth.get_default();
const btStatus = SystemUtilities.checkServiceStatus(['bluetooth.service']);

export const BluetoothDevices = (): JSX.Element => {
    const deviceListBinding = Variable.derive(
        [bind(bluetoothService, 'devices'), bind(bluetoothService, 'isPowered')],
        () => {
            const availableDevices = getAvailableBluetoothDevices();
            const connectedDevices = getConnectedBluetoothDevices();

            if (btStatus === 'MISSING') {
                return <BluetoothUnavailable />;
            }

            if (availableDevices.length === 0) {
                return <NoBluetoothDevices />;
            }

            if (!bluetoothService.adapter?.powered) {
                return <BluetoothDisabled />;
            }

            return availableDevices.map((btDevice) => {
                return <DeviceListItem btDevice={btDevice} connectedDevices={connectedDevices} />;
            });
        },
    );
    return (
        <box
            className={'menu-items-section'}
            onDestroy={() => {
                deviceListBinding.drop();
            }}
        >
            <scrollable className={'menu-scroller bluetooth'}>
                <box className={'menu-content'} vertical>
                    {deviceListBinding()}
                </box>
            </scrollable>
        </box>
    );
};
