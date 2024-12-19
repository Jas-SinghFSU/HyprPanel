import { ActionButton } from './ActionButton';
import { isPrimaryClick } from 'src/lib/utils';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { forgetBluetoothDevice } from '../helpers';

export const ForgetButton = ({ device }: ForgetButtonProps): JSX.Element => {
    return (
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
    );
};

interface ForgetButtonProps {
    device: AstalBluetooth.Device;
}
