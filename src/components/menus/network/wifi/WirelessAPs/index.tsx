import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { AccessPoint } from './AccessPoint';
import { Controls } from './Controls';
import { Variable } from 'astal';
import { NetworkService } from 'src/services/network';

const networkService = NetworkService.getInstance();

export const WirelessAPs = (): JSX.Element => {
    const wapBinding = Variable.derive(
        [
            bind(networkService.wifi.staging),
            bind(networkService.wifi.connecting),
            bind(networkService.wifi.wifiAccessPoints),
            bind(networkService.wifi.isWifiEnabled),
        ],
        () => {
            const filteredWAPs = networkService.wifi.getFilteredWirelessAPs();

            if (filteredWAPs.length <= 0 && networkService.wifi.staging.get() === undefined) {
                return (
                    <label
                        className={'waps-not-found dim'}
                        expand
                        halign={Gtk.Align.CENTER}
                        valign={Gtk.Align.CENTER}
                        label={'No Wi-Fi Networks Found'}
                    />
                );
            }

            return (
                <scrollable className={'menu-scroller wap'}>
                    <box className={'available-waps-list'} vertical>
                        {filteredWAPs.map((ap: AstalNetwork.AccessPoint) => {
                            return (
                                <box className={'network-element-item'}>
                                    <AccessPoint
                                        connecting={networkService.wifi.connecting}
                                        accessPoint={ap}
                                    />
                                    <Controls connecting={networkService.wifi.connecting} accessPoint={ap} />
                                </box>
                            );
                        })}
                    </box>
                </scrollable>
            );
        },
    );

    return (
        <box
            className={'available-waps'}
            vertical
            onDestroy={() => {
                wapBinding.drop();
            }}
        >
            {wapBinding()}
        </box>
    );
};
