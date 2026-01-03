import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { NetworkService } from 'src/services/network';
import { Astal, Gtk } from 'astal/gtk3';
import Spinner from 'src/components/shared/Spinner';

const networkService = NetworkService.getInstance();
const astalNetwork = AstalNetwork.get_default();

export const AccessPoint = ({ connecting, accessPoint }: AccessPointProps): JSX.Element => {
    const derivedVars: Variable<unknown>[] = [];

    const isActiveVar = Variable.derive(
        [bind(astalNetwork.wifi, 'activeAccessPoint')],
        (activeAp) => accessPoint.ssid === activeAp?.ssid,
    );
    derivedVars.push(isActiveVar);

    const iconClassVar = Variable.derive([bind(isActiveVar)], (isActive) => {
        return `network-icon wifi ${isActive ? 'active' : ''} txt-icon`;
    });
    derivedVars.push(iconClassVar);

    const showStatusVar = Variable.derive(
        [bind(isActiveVar), bind(astalNetwork.wifi, 'state')],
        (isActive, state) => {
            return isActive && networkService.wifi.isApEnabled(state);
        },
    );
    derivedVars.push(showStatusVar);

    const wifiStatusVar = Variable.derive([bind(astalNetwork.wifi, 'state')], () => {
        return networkService.wifi.getWifiStatus();
    });
    derivedVars.push(wifiStatusVar);

    const showSpinnerVar = Variable.derive(
        [bind(connecting), bind(astalNetwork.wifi, 'activeAccessPoint'), bind(astalNetwork.wifi, 'state')],
        (conn, activeAp, state) => {
            const isConnecting = accessPoint.bssid === conn;
            const isActive = accessPoint.ssid === activeAp?.ssid;
            const isDisconnecting = isActive && state === AstalNetwork.DeviceState.DEACTIVATING;
            return isConnecting || isDisconnecting;
        },
    );
    derivedVars.push(showSpinnerVar);

    const ConnectionIcon = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.START}
                className={bind(iconClassVar)}
                label={networkService.getWifiIcon(accessPoint.iconName)}
            />
        );
    };

    const ConnectionAccessPoint = (): JSX.Element => {
        return (
            <box className="connection-container" valign={Gtk.Align.CENTER} vertical hexpand>
                <label
                    className="active-connection"
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.START}
                    truncate
                    wrap
                    label={accessPoint.ssid ?? ''}
                />
                <revealer revealChild={bind(showStatusVar)}>
                    <label
                        className="connection-status dim"
                        halign={Gtk.Align.START}
                        label={bind(wifiStatusVar)}
                    />
                </revealer>
            </box>
        );
    };

    let isDestroying = false;

    return (
        <button
            className="network-element-item"
            onClick={(_: Astal.Button, event: Astal.ClickEvent) => {
                networkService.wifi.connectToAP(accessPoint, event);
            }}
            setup={(self) => {
                self.connect('unrealize', () => {
                    if (!isDestroying) {
                        isDestroying = true;
                        // Drop all derived Variables to prevent memory leaks
                        derivedVars.forEach((v) => v.drop());
                    }
                });
            }}
        >
            <box hexpand>
                <ConnectionIcon />
                <ConnectionAccessPoint />
                <revealer halign={Gtk.Align.END} valign={Gtk.Align.CENTER} revealChild={bind(showSpinnerVar)}>
                    <Spinner
                        className="spinner wap"
                        setup={(self: Gtk.Spinner) => {
                            self.start();
                        }}
                        halign={Gtk.Align.CENTER}
                        valign={Gtk.Align.CENTER}
                    />
                </revealer>
            </box>
        </button>
    );
};

interface AccessPointProps {
    connecting: Variable<string>;
    accessPoint: AstalNetwork.AccessPoint;
}
