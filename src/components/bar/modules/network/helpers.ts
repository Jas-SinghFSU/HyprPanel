import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { bind, Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';

export const wiredIcon: Variable<string> = Variable('');
export const wirelessIcon: Variable<string> = Variable('');

let wiredIconBinding: Variable<void>;
let wirelessIconBinding: Variable<void>;

const handleWiredIcon = (): void => {
    if (wiredIconBinding) {
        wiredIconBinding();
        wiredIconBinding.drop();
    }

    if (!networkService.wired) {
        return;
    }

    wiredIconBinding = Variable.derive([bind(networkService.wired, 'iconName')], (icon) => {
        wiredIcon.set(icon);
    });
};

const handleWirelessIcon = (): void => {
    if (wirelessIconBinding) {
        wirelessIconBinding();
        wirelessIconBinding.drop();
    }

    if (!networkService.wifi) {
        return;
    }

    wirelessIconBinding = Variable.derive([bind(networkService.wifi, 'iconName')], (icon) => {
        wirelessIcon.set(icon);
    });
};

Variable.derive([bind(networkService, 'wifi')], () => {
    handleWiredIcon();
    handleWirelessIcon();
});

const formatFrequency = (frequency: number): string => {
    return `${(frequency / 1000).toFixed(2)}MHz`;
};

export const formatWifiInfo = (wifi: AstalNetwork.Wifi | null): string => {
    const netSsid = wifi?.ssid ? wifi.ssid : 'None';
    const wifiStrength = wifi?.strength ? wifi.strength : '--';
    const wifiFreq = wifi?.frequency ? formatFrequency(wifi.frequency) : '--';

    return `Network: ${netSsid} \nSignal Strength: ${wifiStrength}% \nFrequency: ${wifiFreq}`;
};
