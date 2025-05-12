import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const networkService = AstalNetwork.get_default();

export const isScanning: Variable<boolean> = Variable(false);
let scanningBinding: Variable<void> | undefined;

Variable.derive([bind(networkService, 'wifi')], () => {
    scanningBinding?.drop();
    scanningBinding = undefined;

    if (networkService.wifi === null) {
        return;
    }

    scanningBinding = Variable.derive([bind(networkService.wifi, 'scanning')], (scanning) => {
        isScanning.set(scanning);
    });
});
