/**
 * Retrieves the appropriate Bluetooth icon based on the provided icon name.
 *
 * This function returns a Bluetooth icon based on the given icon name. If no match is found,
 * it returns a default Bluetooth icon. It uses a predefined mapping of device icon names to Bluetooth icons.
 *
 * @param iconName The name of the icon to look up.
 *
 * @returns The corresponding Bluetooth icon as a string. If no match is found, returns the default Bluetooth icon.
 */
const getBluetoothIcon = (iconName: string): string => {
    const deviceIconMap = [
        ['^audio-card*', '󰎄'],
        ['^audio-headphones*', '󰋋'],
        ['^audio-headset*', '󰋎'],
        ['^audio-input*', '󰍬'],
        ['^audio-speakers*', '󰓃'],
        ['^bluetooth*', '󰂯'],
        ['^camera*', '󰄀'],
        ['^computer*', '󰟀'],
        ['^input-gaming*', '󰍬'],
        ['^input-keyboard*', '󰌌'],
        ['^input-mouse*', '󰍽'],
        ['^input-tablet*', '󰓶'],
        ['^media*', '󱛟'],
        ['^modem*', '󱂇'],
        ['^network*', '󱂇'],
        ['^phone*', '󰄞'],
        ['^printer*', '󰐪'],
        ['^scanner*', '󰚫'],
        ['^video-camera*', '󰕧'],
    ];

    const foundMatch = deviceIconMap.find((icon) => RegExp(icon[0]).test(iconName.toLowerCase()));

    return foundMatch ? foundMatch[1] : '󰂯';
};

export { getBluetoothIcon };
