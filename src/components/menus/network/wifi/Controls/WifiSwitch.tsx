import { Gtk } from 'astal/gtk3';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const networkService = AstalNetwork.get_default();

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
