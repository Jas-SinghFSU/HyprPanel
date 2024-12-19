import { Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { getWifiIcon } from '../../utils';
import { connectToAP, getWifiStatus, isDisconnecting, isApEnabled, isApActive } from './helpers';
import { Gtk } from 'astal/gtk3';
import { networkService } from 'src/lib/constants/services';
import Spinner from 'src/components/shared/Spinner';

export const AccessPoint = ({ connecting, accessPoint }: AccessPointProps): JSX.Element => {
    const ConnectionIcon = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.START}
                className={`network-icon wifi ${isApActive(accessPoint) ? 'active' : ''} txt-icon`}
                label={getWifiIcon(accessPoint.iconName)}
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
                <revealer revealChild={isApActive(accessPoint) && isApEnabled(networkService.wifi?.state)}>
                    <label className="connection-status dim" halign={Gtk.Align.START} label={getWifiStatus()} />
                </revealer>
            </box>
        );
    };

    const LoadingSpinner = (): JSX.Element => {
        return (
            <revealer
                halign={Gtk.Align.END}
                valign={Gtk.Align.CENTER}
                revealChild={accessPoint.bssid === connecting.get() || isDisconnecting(accessPoint)}
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
                connectToAP(accessPoint, event);
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
