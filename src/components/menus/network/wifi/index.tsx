import { Gtk } from 'astal/gtk3';
import Variable from 'astal/variable.js';
import { APStaging } from './APStaging';
import { WirelessAPs } from './WirelessAPs';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { WifiSwitch } from './Controls/WifiSwitch';
import { RefreshButton } from './Controls/RefreshButton';

export const Wifi = (): JSX.Element => {
    const staging = Variable<AstalNetwork.AccessPoint>({} as AstalNetwork.AccessPoint);
    const connecting = Variable<string>('');

    return (
        <box className="menu-section-container wifi" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" halign={Gtk.Align.START} hexpand label="Wi-Fi" />
                <WifiSwitch />
                <RefreshButton />
            </box>

            <box className="menu-items-section" vertical>
                <APStaging staging={staging} connecting={connecting} />
                <WirelessAPs staging={staging} connecting={connecting} />
            </box>
        </box>
    );
};
