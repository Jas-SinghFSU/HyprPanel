import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

/**
 * EthernetManager handles ethernet-related functionality for dropdowns
 */
export class EthernetManager {
    private _astalNetwork: AstalNetwork.Network;

    public wiredState: Variable<AstalNetwork.DeviceState> = Variable(AstalNetwork.DeviceState.UNKNOWN);
    public wiredInternet: Variable<AstalNetwork.Internet> = Variable(AstalNetwork.Internet.DISCONNECTED);
    public wiredIcon: Variable<string> = Variable('');
    public wiredSpeed: Variable<number> = Variable(0);

    private _wiredStateBinding: Variable<void> | undefined;
    private _wiredInternetBinding: Variable<void> | undefined;
    private _wiredIconBinding: Variable<void> | undefined;
    private _wiredSpeedBinding: Variable<void> | undefined;

    constructor(networkService: AstalNetwork.Network) {
        this._astalNetwork = networkService;
    }

    /**
     * Called when the wired service changes to update bindings
     */
    public onWiredServiceChanged(): void {
        this._getWiredState();
        this._getWiredInternet();
        this._getWiredIcon();
        this._getWiredSpeed();
    }

    /**
     * Retrieves the current state of the wired network.
     */
    private _getWiredState(): void {
        this._wiredStateBinding?.drop();
        this._wiredStateBinding = undefined;

        if (this._astalNetwork.wired === null) {
            this.wiredState.set(AstalNetwork.DeviceState.UNAVAILABLE);
            return;
        }

        this._wiredStateBinding = Variable.derive([bind(this._astalNetwork.wired, 'state')], (state) => {
            this.wiredState.set(state);
        });
    }

    /**
     * Retrieves the current internet status of the wired network.
     */
    private _getWiredInternet(): void {
        this._wiredInternetBinding?.drop();
        this._wiredInternetBinding = undefined;

        if (this._astalNetwork.wired === null) {
            return;
        }

        this._wiredInternetBinding = Variable.derive(
            [bind(this._astalNetwork.wired, 'internet')],
            (internet) => {
                this.wiredInternet.set(internet);
            },
        );
    }

    /**
     * Retrieves the current icon for the wired network.
     */
    private _getWiredIcon(): void {
        this._wiredIconBinding?.drop();
        this._wiredIconBinding = undefined;

        if (this._astalNetwork.wired === null) {
            this.wiredIcon.set('network-wired-symbolic');
            return;
        }

        this._wiredIconBinding = Variable.derive([bind(this._astalNetwork.wired, 'iconName')], (icon) => {
            this.wiredIcon.set(icon);
        });
    }

    /**
     * Retrieves the current speed of the wired network.
     */
    private _getWiredSpeed(): void {
        this._wiredSpeedBinding?.drop();
        this._wiredSpeedBinding = undefined;

        if (this._astalNetwork.wired === null) {
            return;
        }

        this._wiredSpeedBinding = Variable.derive([bind(this._astalNetwork.wired, 'speed')], (speed) => {
            this.wiredSpeed.set(speed);
        });
    }
}
