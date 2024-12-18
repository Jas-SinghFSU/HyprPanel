import { Gtk } from 'astal/gtk3';
import { networkService } from 'src/lib/constants/services';

export const WifiSwitch = (): JSX.Element => (
    <switch
        className="menu-switch network"
        valign={Gtk.Align.CENTER}
        tooltipText="Toggle Wifi"
        active={networkService.wifi?.enabled}
        setup={(self) => {
            self.connect('notify::active', () => {
                networkService.wifi?.set_enabled(self.active);
            });
        }}
    />
);
