import { bind } from 'astal';
import { ActionButton } from './ActionButton';
import { isPrimaryClick } from 'src/lib/utils';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

export const ConnectButton = ({ device }: ConnectButtonProps): JSX.Element => {
    return (
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
    );
};

interface ConnectButtonProps {
    device: AstalBluetooth.Device;
}
