import { Gtk } from 'astal/gtk3';
import { RefreshButton } from '../Controls/RefreshButton';
import { WifiSwitch } from '../Controls/WifiSwitch';

export const NoWifi = (): JSX.Element => {
    return (
        <box className="menu-section-container wifi" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" halign={Gtk.Align.START} hexpand label="Wi-Fi" />
                <WifiSwitch />
                <RefreshButton />
            </box>

            <box className="menu-items-section" vertical>
                <label
                    className="waps-not-found dim"
                    expand
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    label="Wi-Fi Adapter Not Found"
                />
            </box>
        </box>
    );
};
