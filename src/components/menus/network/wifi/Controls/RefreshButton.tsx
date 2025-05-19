import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';
import { isScanning } from './helpers';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { isPrimaryClick } from 'src/lib/events/mouse';

const networkService = AstalNetwork.get_default();

export const RefreshButton = (): JSX.Element => {
    return (
        <button
            className="menu-icon-button search network"
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.END}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    networkService.wifi?.scan();
                }
            }}
        >
            <icon
                className={bind(isScanning).as((scanning) => (scanning ? 'spinning-icon' : ''))}
                icon="view-refresh-symbolic"
            />
        </button>
    );
};
