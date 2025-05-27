import { bind } from 'astal';
import { ActionButton } from './ActionButton';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';

export const TrustButton = ({ device }: TrustButtonProps): JSX.Element => {
    return (
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
    );
};

interface TrustButtonProps {
    device: AstalBluetooth.Device;
}
