import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { AccessPoint } from './AccessPoint';
import { Controls } from './Controls';
import { Variable } from 'astal';
import { NetworkService } from 'src/services/network';

const networkService = NetworkService.getInstance();

export const WirelessAPs = (): JSX.Element => {
    const filteredWAPs = Variable.derive(
        [
            bind(networkService.wifi.staging),
            bind(networkService.wifi.connecting),
            bind(networkService.wifi.wifiAccessPoints),
            bind(networkService.wifi.isWifiEnabled),
        ],
        () => networkService.wifi.getFilteredWirelessAPs(),
    );

    const hasNetworks = Variable.derive(
        [bind(filteredWAPs), bind(networkService.wifi.staging)],
        (aps, staging) => {
            return aps.length > 0 || staging !== undefined;
        },
    );

    let isDestroying = false;

    return (
        <box
            className={'available-waps'}
            vertical
            setup={(self: { connect: (arg0: string, arg1: () => void) => void }) => {
                self.connect('unrealize', () => {
                    if (!isDestroying) {
                        isDestroying = true;
                        filteredWAPs.drop();
                        hasNetworks.drop();
                    }
                });
            }}
        >
            <revealer revealChild={bind(hasNetworks).as((v) => !v)}>
                <label
                    className={'waps-not-found dim'}
                    expand
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    label={'No Wi-Fi Networks Found'}
                />
            </revealer>
            <revealer revealChild={bind(hasNetworks)}>
                <scrollable className={'menu-scroller wap'}>
                    <box className={'available-waps-list'} vertical>
                        {bind(filteredWAPs).as((aps) =>
                            aps.map((ap: AstalNetwork.AccessPoint) => (
                                <box className={'network-element-item'}>
                                    <AccessPoint
                                        connecting={networkService.wifi.connecting}
                                        accessPoint={ap}
                                    />
                                    <Controls connecting={networkService.wifi.connecting} accessPoint={ap} />
                                </box>
                            )),
                        )}
                    </box>
                </scrollable>
            </revealer>
        </box>
    );
};
