import { Gdk, Gtk } from 'astal/gtk3';
import { networkService } from 'src/lib/constants/services';
import { useHook } from 'src/lib/shared/hookHandler';

export const WifiSwitch = (): JSX.Element => (
    <switch
        className="menu-switch network"
        valign={Gtk.Align.CENTER}
        tooltipText="Toggle Wifi"
        setup={(self) => {
            useHook(self, networkService, () => {
                self.set_active(networkService.wifi.enabled);
            });
        }}
        onButtonPressEvent={(_, event) => {
            const buttonClicked = event.get_button()[1];

            if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                return;
            }

            networkService.wifi.set_enabled(!networkService.wifi.enabled);
        }}
    />
);
