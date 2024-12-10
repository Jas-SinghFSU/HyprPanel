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
