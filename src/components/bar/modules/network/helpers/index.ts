import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const formatFrequency = (frequency: number): string => {
    return `${(frequency / 1000).toFixed(2)}MHz`;
};

export const formatWifiInfo = (wifi: AstalNetwork.Wifi | null): string => {
    const netSsid = wifi?.ssid ? wifi.ssid : 'None';
    const wifiStrength = wifi?.strength ? wifi.strength : '--';
    const wifiFreq = wifi?.frequency ? formatFrequency(wifi.frequency) : '--';

    return `Network: ${netSsid} \nSignal Strength: ${wifiStrength}% \nFrequency: ${wifiFreq}`;
};
