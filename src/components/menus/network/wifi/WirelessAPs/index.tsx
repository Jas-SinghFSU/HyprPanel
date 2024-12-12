import { networkService } from 'src/lib/constants/services';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { getFilteredWirelessAPs } from './helpers';
import { AccessPoint } from './AccessPoint';
import { Controls } from './Controls';
import { Variable } from 'astal';

export const WirelessAPs = ({ staging, connecting }: WirelessAPsProps): JSX.Element => {
    return (
        <box className="available-waps" vertical>
            {Variable.derive(
                [
                    bind(staging),
                    bind(connecting),
                    bind(networkService.wifi, 'accessPoints'),
                    bind(networkService.wifi, 'enabled'),
                ],
                () => {
                    const filteredWAPs = getFilteredWirelessAPs(staging);

                    if (filteredWAPs.length <= 0 && Object.keys(staging.get()).length === 0) {
                        return (
                            <label
                                className="waps-not-found dim"
                                expand
                                halign={Gtk.Align.CENTER}
                                valign={Gtk.Align.CENTER}
                                label="No Wi-Fi Networks Found"
                            />
                        );
                    }

                    return (
                        <box className="available-waps-list" vertical>
                            {filteredWAPs.map((ap: AstalNetwork.AccessPoint) => {
                                return (
                                    <box className="network-element-item">
                                        <AccessPoint connecting={connecting} accessPoint={ap} staging={staging} />
                                        <Controls connecting={connecting} accessPoint={ap} />
                                    </box>
                                );
                            })}
                        </box>
                    );
                },
            )()}
        </box>
    );
};

interface WirelessAPsProps {
    staging: Variable<AstalNetwork.AccessPoint>;
    connecting: Variable<string>;
}
