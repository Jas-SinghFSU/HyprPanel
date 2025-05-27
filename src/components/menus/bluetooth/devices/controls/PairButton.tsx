import { bind } from 'astal';
import { ActionButton } from './ActionButton';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';

export const PairButton = ({ device }: PairButtonProps): JSX.Element => {
    return (
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
    );
};

interface PairButtonProps {
    device: AstalBluetooth.Device;
}
