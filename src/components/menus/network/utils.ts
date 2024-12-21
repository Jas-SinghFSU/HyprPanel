import { WifiIcon } from 'src/lib/types/network';

/**
 * Retrieves the appropriate WiFi icon based on the provided icon name.
 *
 * This function returns a WiFi icon based on the given icon name. If the icon name is not provided,
 * it returns a default icon. It uses a predefined mapping of device icon names to WiFi icons.
 *
 * @param iconName The name of the icon to look up. If not provided, a default icon is returned.
 *
 * @returns The corresponding WiFi icon as a string.
 */
const getWifiIcon = (iconName?: string): WifiIcon => {
    if (iconName === undefined) {
        return '󰤫' as WifiIcon;
    }
    const deviceIconMap: [string, WifiIcon][] = [
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
    ];

    const foundMatch = deviceIconMap.find((icon) => RegExp(icon[0]).test(iconName.toLowerCase()));

    return foundMatch ? foundMatch[1] : '󰤨';
};

export { getWifiIcon };
