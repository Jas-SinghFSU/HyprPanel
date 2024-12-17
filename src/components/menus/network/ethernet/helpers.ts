import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { networkService } from 'src/lib/constants/services';

/*******************************************
 *                 Values                  *
 *******************************************/
export const wiredState: Variable<AstalNetwork.DeviceState> = Variable(AstalNetwork.DeviceState.UNKNOWN);
export const wiredInternet: Variable<AstalNetwork.Internet> = Variable(AstalNetwork.Internet.DISCONNECTED);
export const wiredIcon: Variable<string> = Variable('');
export const wiredSpeed: Variable<number> = Variable(0);

/*******************************************
 *                Bindings                 *
 *******************************************/
let wiredStateBinding: Variable<void>;
let wiredInternetBinding: Variable<void>;
let wiredIconBinding: Variable<void>;
let wiredSpeedBinding: Variable<void>;

const getWiredState = (): void => {
    if (wiredStateBinding) {
        wiredStateBinding();
        wiredStateBinding.drop();
    }

    if (!networkService.wired) {
        return;
    }

    wiredStateBinding = Variable.derive([bind(networkService.wired, 'state')], (state) => {
        wiredState.set(state);
    });
};

const getWiredInternet = (): void => {
    if (wiredInternetBinding) {
        wiredInternetBinding();
        wiredInternetBinding.drop();
    }

    if (!networkService.wired) {
        return;
    }

    wiredInternetBinding = Variable.derive([bind(networkService.wired, 'internet')], (internet) => {
        wiredInternet.set(internet);
    });
};

const getWiredIcon = (): void => {
    if (wiredIconBinding) {
        wiredIconBinding();
        wiredIconBinding.drop();
    }

    if (!networkService.wired) {
        return;
    }

    wiredIconBinding = Variable.derive([bind(networkService.wired, 'iconName')], (icon) => {
        wiredIcon.set(icon);
    });
};

const getWiredSpeed = (): void => {
    if (wiredSpeedBinding) {
        wiredSpeedBinding();
        wiredSpeedBinding.drop();
    }

    if (!networkService.wired) {
        return;
    }

    wiredSpeedBinding = Variable.derive([bind(networkService.wired, 'speed')], (speed) => {
        wiredSpeed.set(speed);
    });
};

Variable.derive([bind(networkService, 'wired')], () => {
    getWiredState();
    getWiredInternet();
    getWiredIcon();
    getWiredSpeed();
});
