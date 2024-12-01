import { WifiIcon } from 'src/lib/types/network';

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
