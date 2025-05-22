import { WifiIcon } from './types';

const wifiIconMap = new Map<string, WifiIcon>([
    ['network-wireless-acquiring', '󰤩'],
    ['network-wireless-connected', '󰤨'],
    ['network-wireless-encrypted', '󰤪'],
    ['network-wireless-hotspot', '󰤨'],
    ['network-wireless-no-route', '󰤩'],
    ['network-wireless-offline', '󰤮'],
    ['network-wireless-signal-excellent', '󰤨'],
    ['network-wireless-signal-good', '󰤥'],
    ['network-wireless-signal-ok', '󰤢'],
    ['network-wireless-signal-weak', '󰤟'],
    ['network-wireless-signal-none', '󰤯'],
]);

/**
 * Retrieves the appropriate WiFi icon based on the provided icon name.
 * @param iconName The name of the icon to look up. If not provided, a default icon is returned.
 * @returns The corresponding WiFi icon as a string.
 */
export const getWifiIcon = (iconName?: string): WifiIcon => {
    if (iconName === undefined) {
        return '󰤫';
    }

    const wifiIcon = wifiIconMap.get(iconName.toLowerCase());

    if (wifiIcon) {
        return wifiIcon;
    }

    return '󰤨';
};
