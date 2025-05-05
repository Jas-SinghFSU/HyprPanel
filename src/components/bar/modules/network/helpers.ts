import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { bind, Variable } from 'astal';

export const wiredIcon: Variable<string> = Variable('');
export const wirelessIcon: Variable<string> = Variable('');

const networkService = AstalNetwork.get_default();

let wiredIconBinding: Variable<void> | undefined;
let wirelessIconBinding: Variable<void> | undefined;

/**
 * Handles the wired network icon binding.
 *
 * This function sets up the binding for the wired network icon. It first drops any existing binding,
 * then checks if the wired network service is available. If available, it binds the icon name to the `wiredIcon` variable.
 */
const handleWiredIcon = (): void => {
    wiredIconBinding?.drop();
    wiredIconBinding = undefined;

    if (networkService.wired === null) {
        return;
    }

    wiredIconBinding = Variable.derive([bind(networkService.wired, 'iconName')], (icon) => {
        wiredIcon.set(icon);
    });
};

/**
 * Handles the wireless network icon binding.
 *
 * This function sets up the binding for the wireless network icon. It first drops any existing binding,
 * then checks if the wireless network service is available. If available, it binds the icon name to the `wirelessIcon` variable.
 */
const handleWirelessIcon = (): void => {
    wirelessIconBinding?.drop();
    wirelessIconBinding = undefined;

    if (networkService.wifi === null) {
        return;
    }

    wirelessIconBinding = Variable.derive([bind(networkService.wifi, 'iconName')], (icon) => {
        wirelessIcon.set(icon);
    });
};

/**
 * Formats the frequency value to MHz.
 *
 * This function takes a frequency value in kHz and formats it to MHz with two decimal places.
 *
 * @param frequency The frequency value in kHz.
 *
 * @returns The formatted frequency value in MHz as a string.
 */
const formatFrequency = (frequency: number): string => {
    return `${(frequency / 1000).toFixed(2)}MHz`;
};

/**
 * Formats the WiFi information for display.
 *
 * This function takes a WiFi object and formats its SSID, signal strength, and frequency for display.
 *
 * @param wifi The WiFi object containing SSID, signal strength, and frequency information.
 *
 * @returns A formatted string containing the WiFi information.
 */
export const formatWifiInfo = (wifi: AstalNetwork.Wifi): string => {
    return `Network: ${wifi.ssid} \nSignal Strength: ${wifi.strength}% \nFrequency: ${formatFrequency(wifi.frequency)}`;
};

Variable.derive([bind(networkService, 'state'), bind(networkService, 'connectivity')], () => {
    handleWiredIcon();
    handleWirelessIcon();
});
