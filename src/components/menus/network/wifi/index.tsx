import { Gdk, Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import { networkService } from 'src/lib/constants/services.js';
import Variable from 'astal/variable.js';
import { AccessPoint } from 'src/lib/types/network.js';
import { isPrimaryClick } from 'src/lib/utils.js';
import { APStaging } from './APStaging';
import { WirelessAPs } from './WirelessAPs';

export const Wifi = (): JSX.Element => {
    const staging = Variable<AccessPoint>({} as AccessPoint);
    const connecting = Variable<string>('');

    Variable.derive([bind(networkService.wifi, 'scanning')], (scanning) => {
        console.log(scanning);
    });
    return (
        <box className="menu-section-container wifi" vertical>
            <box className="menu-label-container" halign={Gtk.Align.FILL}>
                <label className="menu-label" halign={Gtk.Align.START} hexpand label="Wi-Fi" />
                <switch
                    className="menu-switch network"
                    valign={Gtk.Align.CENTER}
                    tooltipText="Toggle Wifi"
                    onButtonPressEvent={(self, event) => {
                        const buttonClicked = event.get_button()[1];

                        if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                            return;
                        }

                        networkService.wifi.set_enabled(!self.active);
                    }}
                    active={bind(networkService.wifi, 'enabled')}
                />
                <button
                    className="menu-icon-button search network"
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.END}
                    onClick={(_, event) => {
                        if (isPrimaryClick(event)) {
                            networkService.wifi.scan();
                        }
                    }}
                >
                    <icon
                        className={bind(networkService.wifi, 'scanning').as((scanning) =>
                            scanning ? 'spinning-icon' : '',
                        )}
                        icon="view-refresh-symbolic"
                    />
                </button>
            </box>

            <box className="menu-items-section" vertical>
                <APStaging staging={staging} connecting={connecting} />
                <WirelessAPs staging={staging} connecting={connecting} />
            </box>
        </box>
    );
};
