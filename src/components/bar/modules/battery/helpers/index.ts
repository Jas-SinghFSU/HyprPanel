import { BatteryIconKeys, BatteryIcons } from 'src/lib/types/battery';

const batteryIcons: BatteryIcons = {
    0: '󰂎',
    10: '󰁺',
    20: '󰁻',
    30: '󰁼',
    40: '󰁽',
    50: '󰁾',
    60: '󰁿',
    70: '󰂀',
    80: '󰂁',
    90: '󰂂',
    100: '󰁹',
};

const batteryIconsCharging: BatteryIcons = {
    0: '󰢟',
    10: '󰢜',
    20: '󰂆',
    30: '󰂇',
    40: '󰂈',
    50: '󰢝',
    60: '󰂉',
    70: '󰢞',
    80: '󰂊',
    90: '󰂋',
    100: '󰂅',
};

export const getBatteryIcon = (percentage: number, charging: boolean, isCharged: boolean): string => {
    if (isCharged) {
        return '󱟢';
    }
    const percentages: BatteryIconKeys[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
    const foundPercentage = percentages.find((threshold) => threshold <= percentage) ?? 100;

    return charging ? batteryIconsCharging[foundPercentage] : batteryIcons[foundPercentage];
};
