import { Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { NetworkService } from 'src/services/network';
import { Gtk } from 'astal/gtk3';
import Spinner from 'src/components/shared/Spinner';

const networkService = NetworkService.getInstance();
const astalNetwork = AstalNetwork.get_default();

export const AccessPoint = ({ connecting, accessPoint }: AccessPointProps): JSX.Element => {
    const ConnectionIcon = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.START}
                className={`network-icon wifi ${networkService.wifi.isApActive(accessPoint) ? 'active' : ''} txt-icon`}
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
                <revealer
                    revealChild={
                        networkService.wifi.isApActive(accessPoint) &&
                        networkService.wifi.isApEnabled(astalNetwork.wifi?.state)
                    }
                >
                    <label
                        className="connection-status dim"
                        halign={Gtk.Align.START}
                        label={networkService.wifi.getWifiStatus()}
                    />
                </revealer>
            </box>
        );
    };

    const LoadingSpinner = (): JSX.Element => {
        return (
            <revealer
                halign={Gtk.Align.END}
                valign={Gtk.Align.CENTER}
                revealChild={
                    accessPoint.bssid === connecting.get() || networkService.wifi.isDisconnecting(accessPoint)
                }
            >
                <Spinner
                    className="spinner wap"
                    setup={(self: Spinner) => {
                        self.start();
                    }}
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                />
            </revealer>
        );
    };

    return (
        <button
            className="network-element-item"
            onClick={(_, event) => {
                networkService.wifi.connectToAP(accessPoint, event);
            }}
        >
            <box hexpand>
                <ConnectionIcon />
                <ConnectionAccessPoint />
                <LoadingSpinner />
            </box>
        </button>
    );
};

interface AccessPointProps {
    connecting: Variable<string>;
    accessPoint: AstalNetwork.AccessPoint;
}
