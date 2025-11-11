import { Gtk } from 'astal/gtk3';

export const BluetoothUnavailable = (): JSX.Element => {
    return (
        <box
            className={'bluetooth-items'}
            vertical
            expand
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
        >
            <label className={'no-bluetooth-devices dim'} hexpand label={'Bluetooth service unavailable'} />
            <label
                className={'no-bluetooth-devices dim'}
                hexpand
                label={'Please install bluez and bluez-utils'}
            />
        </box>
    );
};
