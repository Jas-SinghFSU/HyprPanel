import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { bluetoothService } from 'src/lib/constants/services';

const isPowered = Variable(false);

Variable.derive([bind(bluetoothService, 'isPowered')], (isOn) => {
    return isPowered.set(isOn);
});

export const ToggleSwitch = (): JSX.Element => (
    <switch
        className="menu-switch bluetooth"
        halign={Gtk.Align.END}
        hexpand
        active={bluetoothService.isPowered}
        setup={(self) => {
            self.connect('notify::active', () => {
                bluetoothService.adapter?.set_powered(self.active);
            });
        }}
    />
);
