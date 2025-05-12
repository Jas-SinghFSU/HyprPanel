import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const networkService = AstalNetwork.get_default();

export const isWifiEnabled: Variable<boolean> = Variable(false);
let wifiEnabledBinding: Variable<void> | undefined;

Variable.derive([bind(networkService, 'wifi')], () => {
    wifiEnabledBinding?.drop();
    wifiEnabledBinding = undefined;

    if (networkService.wifi === null) {
        return;
    }

    wifiEnabledBinding = Variable.derive([bind(networkService.wifi, 'enabled')], (isEnabled) => {
        isWifiEnabled.set(isEnabled);
    });
});
