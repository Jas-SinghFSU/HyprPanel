import { Gdk, Gtk } from 'astal/gtk3';
import { bind } from '../../../../../../../../../../usr/share/astal/gjs';
import { bluetoothService } from 'src/lib/constants/services';

export const ToggleSwitch = (): JSX.Element => (
    <switch
        className="menu-switch bluetooth"
        hexpand
        halign={Gtk.Align.END}
        active={bind(bluetoothService, 'isPowered')}
        onButtonPressEvent={(_, event) => {
            const buttonClicked = event.get_button()[1];
            if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                return;
            }

            if (bluetoothService.adapter.powered) {
                bluetoothService.adapter.set_powered(false);
            } else {
                bluetoothService.adapter.set_powered(true);
            }
        }}
    />
);
