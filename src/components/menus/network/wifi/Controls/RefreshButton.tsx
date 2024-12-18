import { Gtk } from 'astal/gtk3';
import { networkService } from 'src/lib/constants/services';
import { bind } from 'astal';
import { isPrimaryClick } from 'src/lib/utils';
import { isScanning } from './helpers';

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
