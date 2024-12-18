import { Variable } from 'astal';
import { disconnectFromAP, forgetAP, isApActive } from './helpers';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { Gtk } from 'astal/gtk3';

export const Controls = ({ connecting, accessPoint }: ControlsProps): JSX.Element => {
    const DisconnectButton = (): JSX.Element => {
        return (
            <button
                className="menu-icon-button network disconnect"
                onClick={(_, event) => {
                    disconnectFromAP(accessPoint, event);
                }}
            >
                <label className="menu-icon-button disconnect-network txt-icon" tooltipText="Disconnect" label="󱘖" />
            </button>
        );
    };

    const ForgetButton = (): JSX.Element => {
        return (
            <button
                className="menu-icon-button network disconnect"
                tooltipText="Delete/Forget Network"
                onClick={(_, event) => {
                    forgetAP(accessPoint, event);
                }}
            >
                <label className="txt-icon delete-network" label="󰚃" />
            </button>
        );
    };

    return (
        <revealer
            revealChild={accessPoint.bssid !== connecting.get() && isApActive(accessPoint)}
            valign={Gtk.Align.START}
        >
            <box className={'network-element-controls-container'}>
                <DisconnectButton />
                <ForgetButton />
            </box>
        </revealer>
    );
};

interface ControlsProps {
    connecting: Variable<string>;
    accessPoint: AstalNetwork.AccessPoint;
}
