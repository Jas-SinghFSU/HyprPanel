import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { connecting, getFilteredWirelessAPs, isWifiEnabled, staging, wifiAccessPoints } from './helpers';
import { AccessPoint } from './AccessPoint';
import { Controls } from './Controls';
import { Variable } from 'astal';

export const WirelessAPs = (): JSX.Element => {
    const wapBinding = Variable.derive(
        [bind(staging), bind(connecting), bind(wifiAccessPoints), bind(isWifiEnabled)],
        () => {
            const filteredWAPs = getFilteredWirelessAPs();

            if (filteredWAPs.length <= 0 && staging.get() === undefined) {
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
                                    <AccessPoint connecting={connecting} accessPoint={ap} />
                                    <Controls connecting={connecting} accessPoint={ap} />
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
