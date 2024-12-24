import { bind, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';

export const isScanning: Variable<boolean> = Variable(false);
let scanningBinding: Variable<void> | undefined;

Variable.derive([bind(networkService, 'wifi')], () => {
    scanningBinding?.drop();
    scanningBinding = undefined;

    if (!networkService.wifi) {
        return;
    }

    scanningBinding = Variable.derive([bind(networkService.wifi, 'scanning')], (scanning) => {
        isScanning.set(scanning);
    });
});
