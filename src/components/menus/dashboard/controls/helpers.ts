import { bind, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';

export const isWifiEnabled: Variable<boolean> = Variable(false);
let wifiEnabledBinding: Variable<void>;

Variable.derive([bind(networkService, 'wifi')], () => {
    if (wifiEnabledBinding) {
        wifiEnabledBinding();
        wifiEnabledBinding.drop();
    }

    if (!networkService.wifi) {
        return;
    }

    wifiEnabledBinding = Variable.derive([bind(networkService.wifi, 'enabled')], (isEnabled) => {
        isWifiEnabled.set(isEnabled);
    });
});
