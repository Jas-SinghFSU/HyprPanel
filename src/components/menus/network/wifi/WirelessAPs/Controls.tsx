import { bind, Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Gtk } from 'astal/gtk3';
import { NetworkService } from 'src/services/network';

const networkService = NetworkService.getInstance();
const astalNetwork = AstalNetwork.get_default();

export const Controls = ({ connecting, accessPoint }: ControlsProps): JSX.Element => {
    const derivedVars: Variable<unknown>[] = [];

    const DisconnectButton = (): JSX.Element => {
        return (
            <button
                className="menu-icon-button network disconnect"
                onClick={(_, event) => {
                    networkService.wifi.disconnectFromAP(accessPoint, event);
                }}
            >
                <label
                    className="menu-icon-button disconnect-network txt-icon"
                    tooltipText="Disconnect"
                    label="󱘖"
                />
            </button>
        );
    };

    const ForgetButton = (): JSX.Element => {
        return (
            <button
                className="menu-icon-button network disconnect"
                tooltipText="Delete/Forget Network"
                onClick={(_, event) => {
                    networkService.wifi.forgetAP(accessPoint, event);
                }}
            >
                <label className="txt-icon delete-network" label="󰚃" />
            </button>
        );
    };

    const showDisconnectVar = Variable.derive(
        [bind(connecting), bind(astalNetwork.wifi, 'activeAccessPoint')],
        (conn, activeAp) => {
            const isActive = accessPoint.ssid === activeAp?.ssid;
            const notConnecting = accessPoint.bssid !== conn;
            return isActive && notConnecting;
        },
    );
    derivedVars.push(showDisconnectVar);

    const showForgetVar = Variable.derive(
        [bind(networkService.wifi.savedNetworks), bind(astalNetwork.wifi, 'activeAccessPoint')],
        (savedNets, activeAp) => {
            const isSaved = savedNets.includes(accessPoint.ssid || '');
            const isActive = accessPoint.ssid === activeAp?.ssid;
            return isSaved || isActive;
        },
    );
    derivedVars.push(showForgetVar);

    let isDestroying = false;

    return (
        <box
            valign={Gtk.Align.START}
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
            <revealer revealChild={bind(showDisconnectVar)} valign={Gtk.Align.START}>
                <box className={'network-element-controls-container'}>
                    <DisconnectButton />
                </box>
            </revealer>
            <revealer revealChild={bind(showForgetVar)} valign={Gtk.Align.START}>
                <ForgetButton />
            </revealer>
        </box>
    );
};

interface ControlsProps {
    connecting: Variable<string>;
    accessPoint: AstalNetwork.AccessPoint;
}
