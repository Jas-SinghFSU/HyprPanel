import { Gtk } from 'astal/gtk3';
import AstalWp from 'gi://AstalWp?version=0.1';
import { isPrimaryClick } from 'src/lib/utils';
import { bind } from 'astal';

const DeviceIcon = ({ device, type, icon }: AudioDeviceProps): JSX.Element => {
    return (
        <label
            className={bind(device, 'isDefault').as((isDefault) => {
                return `menu-button-icon ${isDefault ? 'active' : ''} ${type} txt-icon`;
            })}
            label={icon}
        />
    );
};

const DeviceName = ({ device, type }: Omit<AudioDeviceProps, 'icon'>): JSX.Element => {
    return (
        <label
            truncate
            wrap
            className={bind(device, 'description').as((currentDesc) =>
                device.description === currentDesc ? `menu-button-name active ${type}` : `menu-button-name ${type}`,
            )}
            label={device.description}
        />
    );
};

export const AudioDevice = ({ device, type, icon }: AudioDeviceProps): JSX.Element => {
    return (
        <button
            className={`menu-button audio ${type} ${device.id}`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    device.set_is_default(true);
                }
            }}
        >
            <box halign={Gtk.Align.START}>
                <DeviceIcon device={device} type={type} icon={icon} />
                <DeviceName device={device} type={type} />
            </box>
        </button>
    );
};

interface AudioDeviceProps {
    device: AstalWp.Endpoint;
    type: 'playback' | 'input';
    icon: string;
}
