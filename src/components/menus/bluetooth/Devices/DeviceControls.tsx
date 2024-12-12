import { Gtk } from 'astal/gtk3';
import { ButtonProps } from 'astal/gtk3/widget';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { isPrimaryClick } from 'src/lib/utils';
import { forgetBluetoothDevice } from './helpers';
import { bind } from 'astal';
import { Binding } from 'astal';

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
                tooltipText={bind(device, 'paired').as((paired) => (paired ? 'Unpair' : 'Pair'))}
                label={bind(device, 'paired').as((paired) => (paired ? '' : ''))}
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
                tooltipText={bind(device, 'connected').as((connected) => (connected ? 'Disconnect' : 'Connect'))}
                label={bind(device, 'connected').as((connected) => (connected ? '󱘖' : ''))}
                onClick={(_, self) => {
                    if (isPrimaryClick(self) && device.connected) {
                        device.disconnect_device((res) => {
                            console.info(res);
                        });
                    } else {
                        device.connect_device((res) => {
                            console.info(res);
                        });
                    }
                }}
            />
            <ActionButton
                name={'untrust'}
                tooltipText={bind(device, 'trusted').as((trusted) => (trusted ? 'Untrust' : 'Trust'))}
                label={bind(device, 'trusted').as((trusted) => (trusted ? '' : '󱖡'))}
                onClick={(_, self) => {
                    if (isPrimaryClick(self)) {
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
    tooltipText: string | Binding<string>;
    label: string | Binding<string>;
}
