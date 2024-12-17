import { Gdk, Gtk } from 'astal/gtk3';
import { bluetoothService } from 'src/lib/constants/services';
import { useHook } from 'src/lib/shared/hookHandler';

export const ToggleSwitch = (): JSX.Element => (
    <switch
        className="menu-switch bluetooth"
        halign={Gtk.Align.END}
        hexpand
        setup={(self) => {
            useHook(self, bluetoothService, () => {
                self.set_active(bluetoothService.isPowered);
            });
        }}
        onButtonPressEvent={(_, event) => {
            const buttonClicked = event.get_button()[1];

            if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                return;
            }

            bluetoothService.adapter?.set_powered(!bluetoothService.adapter.powered);
        }}
    />
);
