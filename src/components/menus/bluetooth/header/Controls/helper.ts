import { bind, Variable } from 'astal';
import { bluetoothService } from 'src/lib/constants/services';

export const isDiscovering: Variable<boolean> = Variable(false);
let discoveringBinding: Variable<void>;

Variable.derive([bind(bluetoothService, 'adapter')], () => {
    if (discoveringBinding) {
        discoveringBinding();
        discoveringBinding.drop();
    }

    if (!bluetoothService.adapter) {
        return;
    }

    discoveringBinding = Variable.derive([bind(bluetoothService.adapter, 'discovering')], (discovering) => {
        isDiscovering.set(discovering);
    });
});
