import { bind, Variable } from 'astal';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

const bluetoothService = AstalBluetooth.get_default();

export const isDiscovering: Variable<boolean> = Variable(false);
let discoveringBinding: Variable<void> | undefined;

Variable.derive([bind(bluetoothService, 'adapter')], () => {
    discoveringBinding?.drop();
    discoveringBinding = undefined;

    if (bluetoothService.adapter === null) {
        return;
    }

    discoveringBinding = Variable.derive([bind(bluetoothService.adapter, 'discovering')], (discovering) => {
        isDiscovering.set(discovering);
    });
});
