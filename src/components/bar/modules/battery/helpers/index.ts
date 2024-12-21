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

/**
 * Retrieves the appropriate battery icon based on the battery percentage and charging status.
 *
 * This function returns the corresponding battery icon based on the provided battery percentage, charging status, and whether the battery is fully charged.
 * It uses predefined mappings for battery icons and charging battery icons.
 *
 * @param percentage The current battery percentage.
 * @param charging A boolean indicating whether the battery is currently charging.
 * @param isCharged A boolean indicating whether the battery is fully charged.
 *
 * @returns The corresponding battery icon as a string.
 */
export const getBatteryIcon = (percentage: number, charging: boolean, isCharged: boolean): string => {
    if (isCharged) {
        return '󱟢';
    }
    const percentages: BatteryIconKeys[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
    const foundPercentage = percentages.find((threshold) => threshold <= percentage) ?? 100;

    return charging ? batteryIconsCharging[foundPercentage] : batteryIcons[foundPercentage];
};
