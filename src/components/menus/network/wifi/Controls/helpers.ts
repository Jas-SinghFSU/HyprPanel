import { bind, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';

export const isScanning: Variable<boolean> = Variable(false);
let scanningBinding: Variable<void>;

Variable.derive([bind(networkService, 'wifi')], () => {
    if (scanningBinding) {
        scanningBinding();
        scanningBinding.drop();
    }

    if (!networkService.wifi) {
        return;
    }

    scanningBinding = Variable.derive([bind(networkService.wifi, 'scanning')], (scanning) => {
        isScanning.set(scanning);
    });
});
