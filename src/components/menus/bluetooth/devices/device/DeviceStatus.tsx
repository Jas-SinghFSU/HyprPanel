import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalBluetooth from 'gi://AstalBluetooth?version=0.1';

export const DeviceStatus = ({ device }: DeviceStatusProps): JSX.Element => {
    const revealerBinding = Variable.derive(
        [bind(device, 'connected'), bind(device, 'paired')],
        (connected, paired) => {
            return connected || paired;
        },
    );

    return (
        <revealer
            halign={Gtk.Align.START}
            revealChild={revealerBinding()}
            onDestroy={() => {
                revealerBinding.drop();
            }}
        >
            <label
                halign={Gtk.Align.START}
                className={'connection-status dim'}
                label={bind(device, 'connected').as((connected) => (connected ? 'Connected' : 'Paired'))}
            />
        </revealer>
    );
};

interface DeviceStatusProps {
    device: AstalBluetooth.Device;
}
