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

/**
 * Retrieves the current state of the wired network.
 *
 * This function sets up a binding to the `state` property of the wired network service.
 * If the wired network service is available, it updates the `wiredState` variable with the current state.
 */
const getWiredState = (): void => {
    if (wiredStateBinding) {
        wiredStateBinding();
        wiredStateBinding.drop();
    }

    if (!networkService.wired) {
        wiredState.set(AstalNetwork.DeviceState.UNAVAILABLE);
        return;
    }

    wiredStateBinding = Variable.derive([bind(networkService.wired, 'state')], (state) => {
        wiredState.set(state);
    });
};

/**
 * Retrieves the current internet status of the wired network.
 *
 * This function sets up a binding to the `internet` property of the wired network service.
 * If the wired network service is available, it updates the `wiredInternet` variable with the current internet status.
 */
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

/**
 * Retrieves the current icon for the wired network.
 *
 * This function sets up a binding to the `iconName` property of the wired network service.
 * If the wired network service is available, it updates the `wiredIcon` variable with the current icon name.
 */
const getWiredIcon = (): void => {
    if (wiredIconBinding) {
        wiredIconBinding();
        wiredIconBinding.drop();
    }

    if (!networkService.wired) {
        wiredIcon.set('network-wired-symbolic');
        return;
    }

    wiredIconBinding = Variable.derive([bind(networkService.wired, 'iconName')], (icon) => {
        wiredIcon.set(icon);
    });
};

/**
 * Retrieves the current speed of the wired network.
 *
 * This function sets up a binding to the `speed` property of the wired network service.
 * If the wired network service is available, it updates the `wiredSpeed` variable with the current speed.
 */
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

Variable.derive([bind(networkService, 'wired')], () => {
    getWiredState();
    getWiredInternet();
    getWiredIcon();
    getWiredSpeed();
});
