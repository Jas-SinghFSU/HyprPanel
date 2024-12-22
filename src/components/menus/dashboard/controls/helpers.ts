import { bind, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';

export const isWifiEnabled: Variable<boolean> = Variable(false);
let wifiEnabledBinding: Variable<void> | undefined;

Variable.derive([bind(networkService, 'wifi')], () => {
    wifiEnabledBinding?.drop();
    wifiEnabledBinding = undefined;

    if (!networkService.wifi) {
        return;
    }

    wifiEnabledBinding = Variable.derive([bind(networkService.wifi, 'enabled')], (isEnabled) => {
        isWifiEnabled.set(isEnabled);
    });
});
