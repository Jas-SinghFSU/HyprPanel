import { Gtk } from 'astal/gtk3';
import { ButtonProps } from 'astal/gtk3/widget';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { isPrimaryClick } from 'src/lib/utils';
import { forgetBluetoothDevice } from './helpers';

export const DeviceControls = ({ device, connectedDevices }: DeviceControlsProps): JSX.Element => {
    if (!connectedDevices.includes(device.address)) {
        return <box />;
    }
    const ActionButton = ({ name = '', tooltipText = '', label = '', ...props }: ActionButtonProps): JSX.Element => {
        return (
            <button className={`menu-icon-button ${name} bluetooth`} {...props}>
                <label
                    className={`menu-icon-button-label ${name} bluetooth txt-icon`}
                    tooltipText={tooltipText}
                    label={label}
                />
            </button>
        );
    };

    return (
        <box valign={Gtk.Align.START} className={'bluetooth-controls'}>
            <ActionButton
                name={'unpair'}
                tooltipText={device.paired ? 'Unpair' : 'Pair'}
                label={device.paired ? '' : ''}
                onClick={(_, self) => {
                    if (!isPrimaryClick(self)) {
                        return;
                    }

                    if (device.paired) {
                        device.pair();
                    } else {
                        device.cancel_pairing();
                    }
                }}
            />
            <ActionButton
                name={'disconnect'}
                tooltipText={device.connected ? 'Disconnect' : 'Connect'}
                label={device.connected ? '󱘖' : ''}
                onClick={(_, self) => {
                    if (isPrimaryClick(self) && device.connected) {
                        device.disconnect_device();
                    }
                }}
            />
            <ActionButton
                name={'untrust'}
                tooltipText={device.trusted ? 'Untrust' : 'Trust'}
                label={device.trusted ? '' : '󱖡'}
                onClick={(_, self) => {
                    if (isPrimaryClick(self)) {
                        console.log('setting trusted');

                        device.set_trusted(!device.trusted);
                    }
                }}
            />
            <ActionButton
                name={'delete'}
                tooltipText={'Forget'}
                label={'󰆴'}
                onClick={(_, self) => {
                    if (isPrimaryClick(self)) {
                        forgetBluetoothDevice(device);
                    }
                }}
            />
        </box>
    );
};

interface DeviceControlsProps {
    device: AstalBluetooth.Device;
    connectedDevices: string[];
}

interface ActionButtonProps extends ButtonProps {
    name: string;
    tooltipText: string;
    label: string;
}
