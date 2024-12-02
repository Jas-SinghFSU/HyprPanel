import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { getBluetoothIcon } from '../utils';
import Spinner from 'src/components/shared/Spinner';
import { isPrimaryClick } from 'src/lib/utils';
import { bind, Variable } from 'astal';

export const BluetoothDevice = ({ device, connectedDevices }: BluetoothDeviceProps): JSX.Element => {
    const DeviceIcon = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.START}
                className={bind(device, 'address').as(
                    (address) =>
                        `menu-button-icon bluetooth ${connectedDevices.includes(address) ? 'active' : ''} txt-icon`,
                )}
                label={bind(device, 'icon').as((icon) => getBluetoothIcon(`${icon}-symbolic`))}
            />
        );
    };
    const DeviceName = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.START}
                className="menu-button-name bluetooth"
                truncate
                wrap
                label={bind(device, 'alias')}
            />
        );
    };
    const DeviceStatus = (): JSX.Element => {
        return (
            <revealer
                halign={Gtk.Align.START}
                reveal_child={Variable.derive(
                    [bind(device, 'connected'), bind(device, 'paired')],
                    (connected, paired) => {
                        return connected || paired;
                    },
                )()}
            >
                <label
                    halign={Gtk.Align.START}
                    className={'connection-status dim'}
                    label={bind(device, 'connected').as((connected) => (connected ? 'Connected' : 'Paired'))}
                />
            </revealer>
        );
    };

    const IsConnectingSpinner = (): JSX.Element => {
        return (
            <revealer revealChild={bind(device, 'connecting')}>
                <Spinner valign={Gtk.Align.START} className="spinner bluetooth" />
            </revealer>
        );
    };

    return (
        <button
            hexpand
            className={`bluetooth-element-item ${device}`}
            onClick={(_, event) => {
                if (!connectedDevices.includes(device.address) && isPrimaryClick(event)) {
                    device.connect_device((res) => {
                        console.info(res);
                    });
                }
            }}
        >
            <box>
                <box hexpand halign={Gtk.Align.START} className="menu-button-container">
                    <DeviceIcon />
                    <box vertical valign={Gtk.Align.CENTER}>
                        <DeviceName />
                        <DeviceStatus />
                    </box>
                </box>
                <box halign={Gtk.Align.END}>
                    <IsConnectingSpinner />
                </box>
            </box>
        </button>
    );
};

interface BluetoothDeviceProps {
    device: AstalBluetooth.Device;
    connectedDevices: string[];
}
