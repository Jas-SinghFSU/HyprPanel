import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { PairButton } from './PairButton';
import { ConnectButton } from './ConnectButton';
import { TrustButton } from './TrustButton';
import { ForgetButton } from './ForgetButton';

export const DeviceControls = ({ device, connectedDevices }: DeviceControlsProps): JSX.Element => {
    if (!connectedDevices.includes(device.address)) {
        return <box />;
    }

    return (
        <box valign={Gtk.Align.START} className={'bluetooth-controls'}>
            <PairButton device={device} />
            <ConnectButton device={device} />
            <TrustButton device={device} />
            <ForgetButton device={device} />
        </box>
    );
};

interface DeviceControlsProps {
    device: AstalBluetooth.Device;
    connectedDevices: string[];
}
