import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';
import { getBluetoothIcon } from '../utils';
import Spinner from 'src/components/shared/Spinner';
import { isPrimaryClick } from 'src/lib/utils';

export const BluetoothDevice = ({ device, connectedDevices }: BluetoothDeviceProps): JSX.Element => {
    const DeviceIcon = (): JSX.Element => {
        return (
            <label
                valign={Gtk.Align.START}
                className={`menu-button-icon bluetooth ${
                    connectedDevices.includes(device.address) ? 'active' : ''
                } txt-icon`}
                label={getBluetoothIcon(`${device.icon}-symbolic`)}
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
                label={device.alias}
            />
        );
    };
    const DeviceStatus = (): JSX.Element => {
        return (
            <revealer halign={Gtk.Align.START} revealChild={device.connected || device.paired}>
                <label
                    halign={Gtk.Align.START}
                    className={'connection-status dim'}
                    label={device.connected ? 'Connected' : 'Paired'}
                />
            </revealer>
        );
    };

    const IsConnectingSpinner = (): JSX.Element => {
        return (
            <revealer revealChild={device.connecting}>
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
