import { Gtk } from 'astal/gtk3';
import { APStaging } from './APStaging';
import { WirelessAPs } from './WirelessAPs';
import { WifiSwitch } from './Controls/WifiSwitch';
import { RefreshButton } from './Controls/RefreshButton';

export const Wifi = (): JSX.Element => {
    return (
        <box className="menu-section-container wifi" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" halign={Gtk.Align.START} hexpand label="Wi-Fi" />
                <WifiSwitch />
                <RefreshButton />
            </box>

            <box className="menu-items-section" vertical>
                <APStaging />
                <WirelessAPs />
            </box>
        </box>
    );
};
