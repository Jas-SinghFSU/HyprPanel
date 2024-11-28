import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const formatFrequency = (frequency: number): string => {
    return `${(frequency / 1000).toFixed(2)}MHz`;
};

export const formatWifiInfo = (wifi: AstalNetwork.Wifi): string => {
    const netSsid = wifi.ssid === '' ? 'None' : wifi.ssid;
    const wifiStrength = wifi.strength >= 0 ? wifi.strength : '--';
    const wifiFreq = wifi.frequency >= 0 ? formatFrequency(wifi.frequency) : '--';

    return `Network: ${netSsid} \nSignal Strength: ${wifiStrength}% \nFrequency: ${wifiFreq}`;
};
